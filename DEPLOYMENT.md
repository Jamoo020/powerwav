HostPinnacle deployment notes
=============================

This file explains how to deploy the `powerwave-av-site` app to HostPinnacle and enable real email delivery for contact enquiries.

1) Environment variables
------------------------
Set the following environment variables in the HostPinnacle dashboard (or in `.env.local` for local testing):

- `SMTP_HOST` — your SMTP server host (e.g., `smtp.yourprovider.com`)
- `SMTP_PORT` — port (usually `587` for TLS, `465` for SSL)
- `SMTP_USER` — SMTP username
- `SMTP_PASS` — SMTP password
- `ENQUIRY_RECIPIENT` — email address where enquiries should be sent (e.g., `info@powerwaveav.com`)

If you don't configure SMTP, the API will still accept enquiries and will log them to the server console (useful for development).

2) Build & start commands
-------------------------
Use these commands in HostPinnacle to build and start the app:

Build:
```
cd powerwave-av-site
npm ci
npm run build
```

Start (production):
```
cd powerwave-av-site
npm run start
```

HostPinnacle typically runs Node apps behind a reverse proxy and will expose the site on the configured domain.

3) Health check and testing
---------------------------
- Health endpoint: `GET /api/health`
  - Response shows whether SMTP vars are configured and whether the SMTP server is reachable.

- Test sending an enquiry (from the server or a terminal):
```
curl -X POST https://<your-domain>/api/contact -H "Content-Type: application/json" -d '{"name":"Test","email":"test@example.com","message":"Hello from HostPinnacle"}'
```

4) Recommended production additions
----------------------------------
- Add server-side validation and a CAPTCHA (reCAPTCHA or hCaptcha) to reduce spam.
- Persist enquiries to a database for auditing and retrieval.
- Configure monitoring and alerts for SMTP failures (so you know if email delivery breaks).

If you want, I can also:
- Add SendGrid/Mailgun API support instead of SMTP.
- Add a small admin UI to view enquiries.
- Add server-side validation and CAPTCHA integration.
