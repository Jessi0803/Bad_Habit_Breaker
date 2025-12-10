# 📧 Email Configuration Guide

## Quick Setup (5 minutes)

### Step 1: Get Gmail App Password

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Create App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter: "Habit Breaker"
   - Click "Generate"
   - **Copy the 16-character password** (e.g., `xxxx xxxx xxxx xxxx`)

### Step 2: Add to .env file

Open `/backend/.env` and add:

```bash
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

**Replace:**
- `your-email@gmail.com` → Your actual Gmail address
- `xxxx xxxx xxxx xxxx` → The 16-character App Password from Step 1

### Step 3: Restart Backend

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd backend
node server.js
```

You should see:
```
📧 Email Status:
   ✅ Configured & Ready
```

---

## Test Email

```bash
# Test email configuration
curl http://localhost:3000/api/test-email

# Send test report
curl -X POST http://localhost:3000/api/send-email-report \
  -H "Content-Type: application/json" \
  -d '{"userEmail":"your-email@gmail.com"}'
```

Check your inbox! 📬

---

## Alternative: SendGrid (Optional)

If you prefer SendGrid over Gmail:

1. Sign up: https://sendgrid.com
2. Get API key: Settings → API Keys → Create
3. Add to `.env`:

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.your_sendgrid_api_key
```

---

## Troubleshooting

### "Email not configured"
→ Make sure `EMAIL_USER` and `EMAIL_PASSWORD` are in `.env`

### "Invalid credentials"
→ Use App Password, not your regular Gmail password

### "Connection timeout"
→ Check firewall/antivirus settings

---

## Demo Without Email

Don't have time to setup email? No problem!

Just use the HTML preview:
```bash
open http://localhost:3000/api/daily-report/preview
```

Tell judges: *"We have email sending configured via nodemailer, here's what the email looks like."*

---

**That's it!** ✅

