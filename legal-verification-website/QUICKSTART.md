# Quick Start Guide

Get your Legal Verification Protocol website up and running in 5 minutes!

## Prerequisites

- Python 3.8+
- Anthropic API key ([Get free credits](https://console.anthropic.com/))

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd legal-verification-website
```

### 2. Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your Anthropic API key
# You can use nano, vim, or any text editor
nano .env
```

Add your API key:
```
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
FLASK_SECRET_KEY=your-random-secret-key
```

Generate a secure Flask secret key:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 5. Run the Application

```bash
python app.py
```

### 6. Open Your Browser

Navigate to: `http://localhost:5000`

## What's Next?

### Customize Your Site

1. **Update Donation Links** (in `templates/support.html`):
   - Buy Me a Coffee URL
   - Ko-fi URL
   - PayPal button ID

2. **Customize Branding**:
   - Site name in `templates/base.html`
   - Colors in `static/css/style.css`

3. **Review Legal Disclaimer**:
   - Review `templates/legal.html`
   - Consult with legal professional if needed

### Deploy to Production

See `README.md` for detailed deployment instructions including:
- VPS/Server deployment with nginx
- Docker deployment
- PaaS deployment (Heroku, Railway, Render)

## Testing the Verification

1. Go to "Verify Document" page
2. Upload a sample legal document or paste text
3. Select document type
4. Accept terms
5. Click "Start Verification"
6. Wait 2-5 minutes for AI analysis
7. Review the structured report

## Troubleshooting

**Can't find .env file?**
- Make sure you copied `.env.example` to `.env`
- The `.env` file is hidden - use `ls -la` to see it

**API Key Error?**
- Check your Anthropic API key is correct
- Ensure you have API credits available
- Check the key starts with `sk-ant-`

**Module Not Found Error?**
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt` again

**Port Already in Use?**
- Change port in `app.py` (last line): `app.run(port=5001)`

## Getting Help

- Read the full `README.md` for detailed documentation
- Check [Anthropic Documentation](https://docs.anthropic.com/)
- Review [Flask Documentation](https://flask.palletsprojects.com/)

## Important Reminders

- This tool is for **educational purposes only**
- Does **NOT** provide legal advice
- Users must seek qualified legal representation
- See full disclaimer in Legal & Compliance page

---

Enjoy your Legal Verification Protocol website!
