/* ample contact form — Cloudflare Worker
 *
 * Receives a POST from the static site's contact form, validates it,
 * checks the honeypot, then sends two emails via Resend:
 *   1. Notification to support@ or partners@ (subject-routed)
 *   2. Auto-reply to the visitor confirming receipt
 *
 * Env (secrets, set via `wrangler secret put`):
 *   RESEND_API_KEY  — Resend API key with sending access for ampleproducts.ca
 *
 * Free tier headroom:
 *   - Cloudflare Workers: 100K req/day on free
 *   - Resend: 3K emails/month, 100/day on free (we send 2 per submission)
 */

const ALLOWED_ORIGINS = [
  'https://jaychaseauto.github.io',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
];

const SUPPORT_EMAIL = 'support@ampleproducts.ca';
const PARTNERS_EMAIL = 'partners@ampleproducts.ca';
const FROM_NOTIFICATION = 'ample contact form <noreply@ampleproducts.ca>';

/* ───────────────────── helpers ───────────────────── */

function corsHeaders(origin) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(origin),
    },
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function validateField(value, name, maxLength) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return `${name} is required.`;
  }
  if (value.length > maxLength) {
    return `${name} is too long (max ${maxLength} characters).`;
  }
  return null;
}

function isPartnerSubject(subject) {
  return /\b(partner|business|wholesale|distribution|distributor|reseller|b2b)\b/i
    .test(subject);
}

/* Rate limit per IP using Cloudflare's Cache API. Not atomic — concurrent
   requests can race and slip one extra through — but it stops the flood
   attack that would burn through Resend's 100/day quota in minutes.
   Free tier, no KV binding needed, no extra setup.

   Window: WINDOW_SECONDS rolling. Cap: MAX_PER_WINDOW submissions per IP.
   Tune in the constants if 5/hour feels wrong for your traffic. */
const RATE_MAX_PER_WINDOW = 5;
const RATE_WINDOW_SECONDS = 3600;

async function checkRateLimit(ip) {
  if (!ip || ip === 'unknown') return { allowed: true };
  const cache = caches.default;
  const key = new Request(`https://internal.rate-limit/${encodeURIComponent(ip)}`);
  const cached = await cache.match(key);
  const now = Date.now();

  if (!cached) {
    await cache.put(key, new Response(JSON.stringify({ count: 1, firstSeen: now }), {
      headers: { 'Cache-Control': `max-age=${RATE_WINDOW_SECONDS}` },
    }));
    return { allowed: true };
  }

  let data;
  try { data = await cached.json(); } catch { data = { count: 0, firstSeen: now }; }

  if (data.count >= RATE_MAX_PER_WINDOW) {
    return { allowed: false, retryAfterSeconds: Math.max(60, RATE_WINDOW_SECONDS - Math.floor((now - data.firstSeen) / 1000)) };
  }

  const remainingTtl = Math.max(60, RATE_WINDOW_SECONDS - Math.floor((now - data.firstSeen) / 1000));
  await cache.put(key, new Response(JSON.stringify({ count: data.count + 1, firstSeen: data.firstSeen }), {
    headers: { 'Cache-Control': `max-age=${remainingTtl}` },
  }));
  return { allowed: true };
}

/* ───────────────────── email composition ───────────────────── */

function buildNotificationEmail({ name, email, subject, message, recipient, routedLabel }) {
  return {
    from: FROM_NOTIFICATION,
    to: [recipient],
    reply_to: email,
    subject: `[${routedLabel}] ${subject}`.slice(0, 200),
    html: `
<div style="font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;max-width:600px;color:#111;">
  <h2 style="font-family:Barlow,sans-serif;text-transform:uppercase;letter-spacing:0.02em;margin:0 0 16px;border-bottom:2px solid #E92024;padding-bottom:8px;">
    New contact form submission
  </h2>
  <table style="border-collapse:collapse;width:100%;font-size:14px;">
    <tr><td style="padding:6px 12px 6px 0;color:#666;width:90px;vertical-align:top;">Name</td><td style="padding:6px 0;">${escapeHtml(name)}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;">Email</td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#E92024;">${escapeHtml(email)}</a></td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;">Subject</td><td style="padding:6px 0;">${escapeHtml(subject)}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;">Routed to</td><td style="padding:6px 0;">${routedLabel} (${escapeHtml(recipient)})</td></tr>
  </table>
  <h3 style="font-family:Barlow,sans-serif;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#666;margin:24px 0 8px;">Message</h3>
  <div style="white-space:pre-wrap;padding:14px 16px;background:#f5f5f5;border-left:3px solid #E92024;border-radius:2px;font-size:14px;line-height:1.6;">${escapeHtml(message)}</div>
  <p style="margin-top:24px;font-size:11px;color:#999;">Reply directly to this email and the sender will receive your response.</p>
</div>`.trim(),
    text:
`New contact form submission

Name:    ${name}
Email:   ${email}
Subject: ${subject}
Routed:  ${routedLabel} (${recipient})

Message:
${message}

---
Reply directly to this email and the sender will receive your response.`,
  };
}

function buildAutoReplyEmail({ email, recipient }) {
  /* Auto-reply is intentionally generic: NO user-supplied content is
     echoed. Without this guard, an attacker can submit the form with
     arbitrary victim emails and use our verified ampleproducts.ca
     identity to deliver spam payloads (subject, message body) to
     thousands of mailboxes. Keep it boring on purpose. */
  return {
    from: `ample <${recipient}>`,
    to: [email],
    reply_to: recipient,
    subject: 'We received your message · ample',
    html: `
<div style="font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;max-width:600px;color:#111;">
  <p style="font-size:15px;line-height:1.6;">Thanks for reaching out. We've received your message and a member of the team will get back to you within two business days.</p>
  <p style="margin-top:24px;font-size:12px;color:#999;">If your inquiry is time sensitive, reach us directly at <a href="mailto:${escapeHtml(recipient)}" style="color:#E92024;">${escapeHtml(recipient)}</a>.</p>
  <p style="margin-top:32px;font-size:11px;color:#999;font-family:Barlow,sans-serif;letter-spacing:0.16em;text-transform:uppercase;">ample · road-ready precision</p>
</div>`.trim(),
    text:
`Thanks for reaching out. We've received your message and a member of the team will get back to you within two business days.

If your inquiry is time sensitive, reach us directly at ${recipient}.

ample · road-ready precision`,
  };
}

/* ───────────────────── handler ───────────────────── */

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed.' }, 405, origin);
    }
    if (!env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return json({ error: 'Email service is not configured.' }, 500, origin);
    }

    /* Rate limit BEFORE parsing. A flood attack costs us one Cache.match
       call and nothing else — no Resend API hits, no quota burn. */
    const ip = request.headers.get('CF-Connecting-IP')
            || request.headers.get('X-Forwarded-For')
            || 'unknown';
    const rateCheck = await checkRateLimit(ip);
    if (!rateCheck.allowed) {
      console.log('Rate limited:', ip);
      return new Response(JSON.stringify({
        error: 'Too many submissions from this address. Please wait a few minutes and try again.',
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Retry-After': String(rateCheck.retryAfterSeconds || 600),
          ...corsHeaders(origin),
        },
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid request body.' }, 400, origin);
    }

    /* Honeypot. Hidden field with an obscure name (not in common
       honeypot training lists). Real users leave it blank, bots fill it.
       We return 200 ok so the bot does not retry but skip sending. */
    if (body._ample_referral_url && String(body._ample_referral_url).trim().length > 0) {
      console.log('Honeypot triggered, skipping send');
      return json({ ok: true }, 200, origin);
    }

    const errors = [
      validateField(body.name, 'Name', 100),
      validateField(body.email, 'Email', 200),
      validateField(body.subject, 'Subject', 200),
      validateField(body.message, 'Message', 5000),
    ].filter(Boolean);
    if (errors.length > 0) {
      return json({ error: errors[0] }, 400, origin);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(body.email)) {
      return json({ error: 'Please enter a valid email address.' }, 400, origin);
    }

    const name = body.name.trim();
    const email = body.email.trim();
    const subject = body.subject.trim();
    const message = body.message.trim();

    const isPartner = isPartnerSubject(subject);
    const recipient = isPartner ? PARTNERS_EMAIL : SUPPORT_EMAIL;
    const routedLabel = isPartner ? 'Partners' : 'Support';

    const sendEmail = (payload) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

    try {
      const [notifResp, replyResp] = await Promise.all([
        sendEmail(buildNotificationEmail({ name, email, subject, message, recipient, routedLabel })),
        sendEmail(buildAutoReplyEmail({ email, recipient })),
      ]);

      if (!notifResp.ok) {
        const err = await notifResp.text();
        console.error('Notification email failed:', notifResp.status, err);
        return json({
          error: 'Could not send your message. Please try again or email us directly at ' + recipient + '.',
        }, 502, origin);
      }
      if (!replyResp.ok) {
        // Auto-reply failure is non-fatal — the team still got the message.
        const err = await replyResp.text();
        console.warn('Auto-reply failed (non-fatal):', replyResp.status, err);
      }
      return json({ ok: true }, 200, origin);
    } catch (err) {
      console.error('Send error:', err && err.stack || err);
      return json({
        error: 'Email service is temporarily unavailable. Please try again in a moment.',
      }, 500, origin);
    }
  },
};
