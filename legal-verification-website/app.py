"""
Legal Verification Protocol Website
Flask application for UK Employment Law document verification
"""

import os
import tempfile
from flask import Flask, render_template, request, jsonify, session
from werkzeug.utils import secure_filename
import anthropic
from datetime import datetime
import uuid

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'

# Allowed file extensions
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx', 'doc'}

# Anthropic API client
anthropic_client = anthropic.Anthropic(
    api_key=os.environ.get('ANTHROPIC_API_KEY')
)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_file(filepath):
    """Extract text from uploaded file"""
    ext = filepath.rsplit('.', 1)[1].lower()

    if ext == 'txt':
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()

    elif ext == 'pdf':
        try:
            import PyPDF2
            with open(filepath, 'rb') as f:
                pdf_reader = PyPDF2.PdfReader(f)
                text = ''
                for page in pdf_reader.pages:
                    text += page.extract_text() + '\n'
                return text
        except Exception as e:
            return f"Error extracting PDF: {str(e)}"

    elif ext in ['docx', 'doc']:
        try:
            import docx
            doc = docx.Document(filepath)
            text = '\n'.join([para.text for para in doc.paragraphs])
            return text
        except Exception as e:
            return f"Error extracting Word document: {str(e)}"

    return "Unsupported file format"

def verify_legal_document(document_text, document_type="General Employment Tribunal Document"):
    """
    Verify legal document using Claude with extended thinking and web search
    """

    verification_prompt = f"""You are a Legal Verification Protocol Agent specializing in UK Employment Law.

Your task is to perform a MANDATORY VERIFICATION PROTOCOL on the following document.

DOCUMENT TYPE: {document_type}

VERIFICATION FRAMEWORK:
You MUST analyze the document against these criteria:

1. SUBSTANTIVE LAW VERIFICATION
   - Identify all legal claims/defenses cited
   - Verify accuracy of legal principles stated
   - Check for current case law (2024 Employment Tribunal Rules)
   - Flag any outdated or incorrect legal references
   - Assess strength of legal arguments

2. PROCEDURAL COMPLIANCE (ET/EAT Rules 2024)
   - Time limits compliance
   - Required forms and contents
   - Proper service/filing procedures
   - Case management directions compliance
   - Mandatory orders compliance

3. PLEADING & PARTICULARISATION STANDARDS
   - Sufficient factual particulars
   - Clear chronology
   - Specific dates, times, persons
   - Quantum properly pleaded
   - Causal links established
   - Material facts vs evidence distinction

4. INTERNAL CONSISTENCY & REASONING QUALITY
   - Logical flow and structure
   - No contradictions
   - Evidence properly referenced
   - Arguments support conclusions
   - Clear and concise drafting

5. DOCUMENT-SPECIFIC REQUIREMENTS
   For ET1: All mandatory sections, ACAS certificate, discrimination details
   For ET3: Response time, grounds fully stated, jurisdictional challenges
   For EAT Appeals: Permission requirements, grounds properly framed, authorities cited
   For Applications: Proper basis, supporting evidence, proportionality

MANDATORY LEGAL DISCLAIMER:
This verification is an EDUCATIONAL TOOL ONLY. It does NOT constitute:
- Legal advice or representation
- A solicitor-client relationship
- Regulated legal services under SRA/BSB rules

OUTPUT FORMAT:
Provide a structured report with:

## EXECUTIVE SUMMARY
[Overall assessment: Ready/Needs Revision/Major Issues]

## SUBSTANTIVE LAW ISSUES
[List all legal issues found with severity: CRITICAL/MAJOR/MINOR]

## PROCEDURAL COMPLIANCE
[List all procedural issues with severity]

## PLEADING QUALITY
[Assessment of particularisation and drafting quality]

## AUTHORITIES & CITATIONS
[Verify all case law cited - check currency and accuracy]

## RECOMMENDATIONS
[Prioritized list of required changes]

## RISK ASSESSMENT
[Litigation risks identified]

---
DOCUMENT TO VERIFY:

{document_text}

---

Begin your mandatory verification protocol now. Use extended thinking to analyze complex legal issues. Search for current case law where needed."""

    try:
        # Create message with extended thinking and web search
        response = anthropic_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=16000,
            thinking={
                "type": "enabled",
                "budget_tokens": 10000
            },
            temperature=0.2,
            messages=[
                {
                    "role": "user",
                    "content": verification_prompt
                }
            ]
        )

        # Extract verification report from response
        report = ""
        for block in response.content:
            if block.type == "text":
                report += block.text + "\n"

        return report

    except Exception as e:
        return f"Error during verification: {str(e)}"

@app.route('/')
def index():
    """Home page"""
    return render_template('index.html')

@app.route('/how-it-works')
def how_it_works():
    """How it works page"""
    return render_template('how_it_works.html')

@app.route('/legal')
def legal():
    """Legal and compliance page"""
    return render_template('legal.html')

@app.route('/verify')
def verify():
    """Upload and verification page"""
    return render_template('verify.html')

@app.route('/support')
def support():
    """Support and donate page"""
    return render_template('support.html')

@app.route('/api/verify', methods=['POST'])
def api_verify():
    """API endpoint for document verification"""

    # Check if terms accepted
    terms_accepted = request.form.get('terms_accepted') == 'true'
    if not terms_accepted:
        return jsonify({'error': 'You must accept the terms and conditions'}), 400

    # Get document text from upload or paste
    document_text = None
    document_type = request.form.get('document_type', 'General Employment Tribunal Document')

    # Check for file upload
    if 'file' in request.files:
        file = request.files['file']
        if file and file.filename and allowed_file(file.filename):
            # Save file temporarily
            filename = secure_filename(file.filename)
            temp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4()}_{filename}")
            file.save(temp_path)

            # Extract text
            document_text = extract_text_from_file(temp_path)

            # Clean up
            try:
                os.remove(temp_path)
            except:
                pass
        elif file and file.filename:
            return jsonify({'error': 'Invalid file type. Please upload TXT, PDF, or DOCX files.'}), 400

    # Check for pasted text
    if not document_text:
        document_text = request.form.get('document_text', '').strip()

    if not document_text or len(document_text) < 100:
        return jsonify({'error': 'Please provide a document with at least 100 characters'}), 400

    # Verify document
    try:
        report = verify_legal_document(document_text, document_type)

        # Store in session for potential follow-up
        session['last_verification'] = {
            'timestamp': datetime.now().isoformat(),
            'document_type': document_type,
            'report': report
        }

        return jsonify({
            'success': True,
            'report': report,
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({'error': f'Verification failed: {str(e)}'}), 500

@app.errorhandler(413)
def too_large(e):
    """Handle file too large error"""
    return jsonify({'error': 'File too large. Maximum size is 16MB.'}), 413

if __name__ == '__main__':
    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Run app
    app.run(host='0.0.0.0', port=5000, debug=True)
