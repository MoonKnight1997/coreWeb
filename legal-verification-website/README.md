# Legal Verification Protocol Website

A focused web application for AI-assisted verification of UK Employment Tribunal and Employment Appeal Tribunal documents.

## Overview

This is an **educational document verification tool** that provides structured analysis of ET/EAT documents against:
- Substantive UK Employment Law
- Procedural requirements (ET/EAT Rules 2024)
- Pleading and particularisation standards
- Internal consistency and reasoning quality

**IMPORTANT:** This tool does NOT provide legal advice or regulated legal services. See full disclaimer in the Legal & Compliance section of the website.

## Features

- **Document Upload & Analysis**: Support for .docx, .pdf, and .txt files
- **AI-Powered Verification**: Uses Anthropic's Claude with extended thinking mode
- **Comprehensive Reports**: Structured verification reports with issue categorization
- **Multiple Document Types**: ET1/ET3, tribunal submissions, EAT appeals, applications, etc.
- **Responsive Design**: Mobile-friendly interface built with Bootstrap 5
- **Privacy-Focused**: No long-term document storage
- **Donation Integration**: Support via Buy Me a Coffee, Ko-fi, and PayPal

## Technology Stack

- **Backend**: Flask (Python 3.8+)
- **AI Engine**: Anthropic Claude API
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Document Processing**: PyPDF2, python-docx
- **Deployment**: Gunicorn (production WSGI server)

## Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Step 1: Clone or Download

```bash
cd legal-verification-website
```

### Step 2: Create Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API keys
nano .env  # or use your preferred editor
```

Required environment variables:
```
ANTHROPIC_API_KEY=your_api_key_here
FLASK_SECRET_KEY=your_random_secret_key_here
```

### Step 5: Run the Application

#### Development Mode

```bash
python app.py
```

The application will be available at `http://localhost:5000`

#### Production Mode

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

Options:
- `-w 4`: Use 4 worker processes
- `-b 0.0.0.0:5000`: Bind to all interfaces on port 5000
- Adjust workers based on your server resources (recommended: 2-4 × CPU cores)

## Project Structure

```
legal-verification-website/
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── .env.example               # Environment variables template
├── README.md                  # This file
├── static/                    # Static assets
│   ├── css/
│   │   └── style.css         # Custom CSS styles
│   └── js/                   # JavaScript files (if needed)
├── templates/                 # HTML templates
│   ├── base.html             # Base template with navigation
│   ├── index.html            # Home/landing page
│   ├── how_it_works.html     # How it works page
│   ├── legal.html            # Legal & compliance page
│   ├── verify.html           # Document upload & verification
│   └── support.html          # Support/donation page
└── uploads/                   # Temporary upload directory (auto-created)
```

## Configuration

### Environment Variables

See `.env.example` for all available configuration options.

Key settings:
- `ANTHROPIC_API_KEY`: Your Anthropic API key (required)
- `FLASK_SECRET_KEY`: Secret key for session management (required)
- `FLASK_ENV`: Set to `production` for production deployment
- `MAX_UPLOAD_SIZE`: Maximum file upload size in bytes (default: 16MB)

### Donation Links

Update the donation links in `templates/support.html`:
- Line ~60: Buy Me a Coffee URL
- Line ~80: Ko-fi URL
- Line ~100: PayPal donation button ID

## Deployment

### Option 1: Traditional VPS/Server

1. Install Python 3.8+ and pip
2. Clone repository and set up virtual environment
3. Install dependencies: `pip install -r requirements.txt`
4. Configure environment variables
5. Set up reverse proxy (nginx/Apache) to forward to Gunicorn
6. Run with Gunicorn: `gunicorn -w 4 -b 127.0.0.1:5000 app:app`
7. Configure SSL/TLS certificate (Let's Encrypt recommended)

Example nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Option 2: Docker

Create `Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

Build and run:
```bash
docker build -t legal-verification .
docker run -p 5000:5000 --env-file .env legal-verification
```

### Option 3: Platform as a Service

#### Heroku
1. Create `Procfile`:
   ```
   web: gunicorn app:app
   ```
2. Deploy: `git push heroku main`
3. Set environment variables in Heroku dashboard

#### Railway/Render/Fly.io
- Most PaaS platforms auto-detect Flask apps
- Configure environment variables in platform dashboard
- Deploy via Git integration

## Security Considerations

### Production Checklist

- [ ] Use strong `FLASK_SECRET_KEY` (generate with `python -c "import secrets; print(secrets.token_hex(32))"`)
- [ ] Enable HTTPS/SSL (Let's Encrypt)
- [ ] Set `FLASK_ENV=production`
- [ ] Configure rate limiting (see Flask-Limiter in requirements.txt)
- [ ] Set up firewall rules
- [ ] Regular security updates for dependencies
- [ ] Configure CORS if needed
- [ ] Enable Flask-Talisman for security headers
- [ ] Regular backups of configuration (not documents - they're not stored)
- [ ] Monitor API usage and costs

### Data Privacy

- Documents are **not stored permanently**
- Temporary files are deleted after processing
- No user account system (no personal data collection)
- Document text is sent to Anthropic API for processing
- See `templates/legal.html` for full privacy policy

## Updating Donation Links

Edit `templates/support.html` to add your donation links:

1. **Buy Me a Coffee** (line ~60):
   ```html
   <a href="https://buymeacoffee.com/YOUR_USERNAME" target="_blank" class="btn btn-warning w-100">
   ```

2. **Ko-fi** (line ~80):
   ```html
   <a href="https://ko-fi.com/YOUR_USERNAME" target="_blank" class="btn btn-info w-100 text-white">
   ```

3. **PayPal** (line ~100):
   ```html
   <a href="https://www.paypal.com/donate/?hosted_button_id=YOUR_BUTTON_ID" target="_blank" class="btn btn-primary w-100">
   ```

## Customization

### Branding

- Update site name in `templates/base.html` (navbar brand)
- Modify color scheme in `static/css/style.css` (CSS variables at top)
- Add logo image to `static/` directory and update navigation

### Legal Disclaimer

- Review and customize `templates/legal.html` for your jurisdiction
- Consult with a legal professional about disclaimers
- Update privacy policy to match your data handling practices

### Document Types

To add more document types:
1. Update dropdown in `templates/verify.html` (line ~55)
2. Optionally customize verification prompt in `app.py` for specific document types

## Monitoring & Maintenance

### Log Monitoring

```bash
# Development
tail -f app.log

# Production (with Gunicorn)
tail -f gunicorn-access.log
tail -f gunicorn-error.log
```

### API Usage Monitoring

Monitor your Anthropic API usage at https://console.anthropic.com/

### Regular Updates

```bash
# Update dependencies
pip install --upgrade -r requirements.txt

# Check for security vulnerabilities
pip audit
```

## Troubleshooting

### Common Issues

**Issue**: "ANTHROPIC_API_KEY not found"
- **Solution**: Ensure `.env` file exists and contains valid API key

**Issue**: "ModuleNotFoundError"
- **Solution**: Activate virtual environment and reinstall dependencies

**Issue**: "Permission denied" on uploads
- **Solution**: Ensure `uploads/` directory has write permissions

**Issue**: PDF extraction fails
- **Solution**: Some PDFs may be scanned images. Use text-based PDFs or extract text manually

**Issue**: Large documents timeout
- **Solution**: Increase timeout in app.py or split document into sections

## Legal Disclaimer

This tool is provided for **educational purposes only** and does NOT constitute:
- Legal advice or representation
- Regulated legal services under SRA/BSB
- A solicitor-client relationship

Users MUST seek qualified legal advice from regulated professionals for all legal proceedings.

See the full legal disclaimer in `templates/legal.html`.

## Support & Contributing

### Getting Help

- Review this README and inline documentation
- Check Anthropic API documentation: https://docs.anthropic.com/
- Flask documentation: https://flask.palletsprojects.com/

### Contributing

This is a personal project for educational purposes. If you'd like to contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commit messages
4. Test thoroughly
5. Submit a pull request

## License

This project is provided as-is for educational purposes. Consult with legal professionals regarding:
- Use of AI for legal document analysis
- Regulatory compliance in your jurisdiction
- Appropriate disclaimers and limitations of liability

## Acknowledgments

- Built with [Anthropic Claude API](https://www.anthropic.com/)
- UI framework: [Bootstrap 5](https://getbootstrap.com/)
- Icons: [Bootstrap Icons](https://icons.getbootstrap.com/)

## Version History

- **v1.0.0** (2025-01-XX): Initial release
  - Core verification functionality
  - Support for ET1/ET3, tribunal submissions, EAT appeals
  - Responsive web interface
  - Donation integration

---

**Important**: This tool does not replace qualified legal advice. Always consult a regulated solicitor or barrister for legal proceedings.
