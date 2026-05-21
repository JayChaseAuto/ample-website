# ample contact form backend

Cloudflare Worker that receives the contact form POST from the static
site and sends two emails via Resend:

1. **Notification** to `support@ampleproducts.ca` or `partners@ampleproducts.ca` (subject-routed)
2. **Auto-reply** to the visitor confirming receipt

## Flow

```
Static site (GitHub Pages)
        ↓ POST  { name, email, subject, message, website }
Cloudflare Worker (this code)
        ↓ Resend API (×2)
support@/partners@ inbox  +  visitor inbox
```

## Setup (one-time, ~30 minutes)

### 1. Create accounts

- [https://resend.com](https://resend.com) — free tier covers 3,000 emails/month, 100/day
- [https://dash.cloudflare.com](https://dash.cloudflare.com) — free tier covers 100,000 Worker requests/day

### 2. Verify `ampleproducts.ca` with Resend

1. Resend dashboard → **Domains** → **Add Domain** → enter `ampleproducts.ca`
2. Resend will display SPF + DKIM (and optional DMARC) DNS records
3. In your DNS provider for `ampleproducts.ca`, add each record exactly as shown
4. Wait ~5 minutes, then click **Verify** in the Resend dashboard
5. Once verified, the worker can send from any `*@ampleproducts.ca` address

### 3. Get a Resend API key

1. Resend → **API Keys** → **Create API Key**
2. Permission: **Sending access**
3. Domain: `ampleproducts.ca` (or "All domains")
4. Copy the key (starts with `re_`). You'll paste it into Wrangler in step 5.

### 4. Install Wrangler and log in

```bash
npm install -g wrangler
wrangler login
```

`wrangler login` opens your browser, asks you to authorize Cloudflare access, and stores a token locally.

### 5. Deploy the worker

From inside this `worker/` directory:

```bash
npm install        # installs wrangler locally
wrangler deploy    # first deploy creates the worker in your account
```

Wrangler prints the live URL, e.g. `https://ample-contact.<your-account>.workers.dev`.

Now attach the Resend secret:

```bash
wrangler secret put RESEND_API_KEY
# paste the re_xxxxx key when prompted, press Enter
```

### 6. Smoke test

```bash
curl -X POST https://ample-contact.<your-account>.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"you@example.com","subject":"Smoke test","message":"Hello from curl."}'
```

Expected response: `{"ok":true}`. Check `support@ampleproducts.ca` for the notification and `you@example.com` for the auto-reply.

### 7. Wire the frontend

In `project/src/OtherPages.jsx`, find the `CONTACT_ENDPOINT` constant near the top of the file and replace its value with your worker URL.

Commit and push — GitHub Pages picks up the change on the next workflow run.

### 8. (Optional) Custom domain

Replace the `*.workers.dev` URL with `api.ampleproducts.ca`:

1. Cloudflare dashboard → **Workers & Pages** → `ample-contact` → **Settings** → **Triggers** → **Add Custom Domain**
2. Enter `api.ampleproducts.ca` and confirm
3. Cloudflare provisions the cert (~1 minute)
4. Update `CONTACT_ENDPOINT` in `OtherPages.jsx` to `https://api.ampleproducts.ca/`

## Day-to-day

| Task | Command |
|---|---|
| Local dev server | `npm run dev` (Wrangler runs the worker on localhost) |
| Deploy a change | `wrangler deploy` |
| Tail live logs | `wrangler tail` |
| Rotate API key | `wrangler secret put RESEND_API_KEY` |

## Monitoring

- **Cloudflare dashboard** → your worker → **Logs**: live request tail with errors
- **Resend dashboard** → **Emails**: delivery history, bounces, opens

## Rate limiting

Built in. The worker enforces **5 submissions per IP per hour** via Cloudflare's Cache API. No extra setup, no KV namespace needed.

A flood attacker hitting the endpoint:
- Burns one Cache.match call per request (free, nearly instant)
- Hits 429 Too Many Requests after the 5th submission within the window
- Never reaches the Resend API, so your daily quota is safe

Tune in `src/worker.js`:
```js
const RATE_MAX_PER_WINDOW = 5;
const RATE_WINDOW_SECONDS = 3600;
```

Cache-based rate limiting is *eventually consistent*, not atomic — two concurrent requests can race and let one extra through. Acceptable for stopping floods; not designed to enforce a hard quota.

## Anti-abuse: auto-reply hardening

The auto-reply intentionally contains **no user-supplied content**. No echoed subject, no echoed message body, no name. Just a generic "we received it" and your support address.

Why: without this guard, an attacker can submit the form with arbitrary victim emails and use your verified `ampleproducts.ca` identity to deliver spam payloads (subject lines + message bodies) to thousands of mailboxes. Keeping the auto-reply boring on purpose eliminates the spam-relay vector.

If you ever want to echo the subject back to the visitor, do it only after adding stronger spam protection (Cloudflare Turnstile, KV-based per-IP throttling tighter than 5/hour, or a CAPTCHA).

## Sender reputation warm-up

A freshly verified `ampleproducts.ca` domain has zero sending reputation. The first 2–3 weeks of mail will land in spam folders at Gmail and Outlook until receivers learn your domain is legitimate.

Recommended warm-up sequence:
1. Send 5–10 test submissions to your own personal Gmail / Outlook accounts
2. Mark each one "Not Spam" / "Move to Inbox"
3. Send the first batch of real customer mail in low volume (≤20/day)
4. Gradually ramp to your real volume over 2 weeks
5. Watch the **Resend dashboard → Emails** view for bounce/spam-complaint rates. Anything above 0.3% is bad — investigate before scaling further.

If you need to send urgent mail before warm-up is complete, fall back to a personal Gmail/Outlook and tell visitors to expect a reply from that address.

## Free-tier limits

| Service | Limit | Notes |
|---|---|---|
| Cloudflare Workers | 100K requests/day | One request per submission |
| Resend | 3K emails/month + 100/day | Two emails per submission (notification + auto-reply) |

At 500–3,000 submissions/month you'll send 1,000–6,000 Resend emails. The upper end blows the free tier — Resend's $20/mo Pro tier covers 50K/month if you need it.

## Troubleshooting

**Form returns "Could not send"**
Run `wrangler tail` and submit the form. The actual Resend error appears in the log. Usual cause: domain not verified, or `RESEND_API_KEY` not set.

**Emails landing in spam**
Confirm all DNS records in Resend show green. Send a test to a fresh address through [mail-tester.com](https://www.mail-tester.com) — anything under 9/10 means a DNS record is off.

**CORS error in browser console**
Add your origin to `ALLOWED_ORIGINS` in `src/worker.js` and redeploy. Default allowlist: GitHub Pages site + localhost dev server.

**429 Too Many Requests**
You hit Resend's 100/day cap. Wait, or upgrade.

## File layout

```
worker/
  README.md          — this file
  package.json       — npm scripts + wrangler dependency
  wrangler.toml      — worker config
  src/
    worker.js        — request handler, validation, Resend calls
```
