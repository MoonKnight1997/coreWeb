"""
Legal Verification Protocol Website v2.0
Flask application for UK Employment Law document verification

Comprehensive redesign with modular architecture, security enhancements,
and improved error handling.
"""

from flask import Flask, render_template, request, jsonify, session
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman
from datetime import datetime

# Import application modules
from app.config import current_config
from app.utils.logger import logger, log_request, log_error
from app.utils.decorators import (
    handle_errors,
    log_request_info,
    require_terms_acceptance
)
from app.services.document import process_document, DocumentProcessingError
from app.services.verification import LegalVerificationService, VerificationError


# ===========================
# APPLICATION INITIALIZATION
# ===========================

app = Flask(__name__)

# Load configuration
app.config.from_object(current_config)

# Initialize verification service
verification_service = LegalVerificationService()

# ===========================
# SECURITY SETUP
# ===========================

# Security headers
if current_config.ENABLE_SECURITY_HEADERS:
    Talisman(
        app,
        force_https=current_config.FORCE_HTTPS,
        content_security_policy=current_config.CSP_DIRECTIVES,
        content_security_policy_nonce_in=['script-src', 'style-src'],
        strict_transport_security=True,
        strict_transport_security_max_age=31536000,
        frame_options='DENY',
        referrer_policy='strict-origin-when-cross-origin'
    )

# Rate limiting
if current_config.RATELIMIT_ENABLED:
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=[current_config.RATELIMIT_DEFAULT],
        storage_uri=current_config.RATELIMIT_STORAGE_URL,
        on_breach=lambda limit: logger.warning(
            'Rate limit exceeded',
            ip=get_remote_address(),
            limit=str(limit)
        )
    )
else:
    # Create dummy limiter that doesn't actually limit
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        enabled=False
    )

# ===========================
# REQUEST/RESPONSE HANDLERS
# ===========================

@app.before_request
def before_request():
    """Log all requests."""
    if not request.path.startswith('/static'):
        logger.info(
            'Request received',
            method=request.method,
            path=request.path,
            ip=request.remote_addr
        )


@app.after_request
def after_request(response):
    """Add security headers and log responses."""
    # Additional security headers not covered by Talisman
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-XSS-Protection'] = '1; mode=block'

    return response


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    logger.warning('Page not found', path=request.path, ip=request.remote_addr)
    return render_template('errors/404.html'), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    log_error(error, {'path': request.path, 'ip': request.remote_addr})
    return render_template('errors/500.html'), 500


@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large errors."""
    logger.warning('File too large', ip=request.remote_addr)
    return jsonify({
        'success': False,
        'error': {
            'type': 'file_too_large',
            'message': f'File too large. Maximum size is {current_config.MAX_CONTENT_LENGTH / (1024 * 1024):.0f}MB.'
        }
    }), 413


@app.errorhandler(429)
def ratelimit_handler(error):
    """Handle rate limit errors."""
    logger.warning('Rate limit hit', ip=request.remote_addr, endpoint=request.endpoint)
    return jsonify({
        'success': False,
        'error': {
            'type': 'rate_limit_exceeded',
            'message': 'Too many requests. Please wait before trying again.'
        }
    }), 429


# ===========================
# ROUTES - PAGES
# ===========================

@app.route('/')
def index():
    """Home page."""
    return render_template('index.html')


@app.route('/how-it-works')
def how_it_works():
    """How it works page."""
    return render_template('how_it_works.html')


@app.route('/legal')
def legal():
    """Legal and compliance page."""
    return render_template('legal.html')


@app.route('/verify')
def verify():
    """Upload and verification page."""
    return render_template('verify.html')


@app.route('/support')
def support():
    """Support and donate page."""
    return render_template('support.html')


# ===========================
# ROUTES - API
# ===========================

@app.route('/api/verify', methods=['POST'])
@limiter.limit(current_config.RATELIMIT_DEFAULT)
@require_terms_acceptance
@handle_errors
@log_request_info
def api_verify():
    """
    API endpoint for document verification.

    Expected form data:
    - file: Document file (optional)
    - document_text: Pasted text (optional)
    - document_type: Type of document
    - terms_accepted: Must be 'true'

    Returns:
        JSON response with verification report
    """
    try:
        # Get document type
        document_type = request.form.get(
            'document_type',
            'General Employment Tribunal Document'
        )

        # Process document (file or text)
        file = request.files.get('file')
        text = request.form.get('document_text', '').strip()

        document_text = process_document(file, text)

        logger.info(
            'Document received for verification',
            document_type=document_type,
            text_length=len(document_text),
            source='file' if file else 'text'
        )

        # Verify document
        result = verification_service.verify_document(document_text, document_type)

        # Store in session for potential follow-up
        session['last_verification'] = {
            'timestamp': result['timestamp'],
            'document_type': document_type,
            'report_preview': result['report'][:500]  # Store preview only
        }

        return jsonify(result), 200

    except DocumentProcessingError as e:
        logger.warning('Document processing error', error=str(e))
        return jsonify({
            'success': False,
            'error': {
                'type': 'document_processing_error',
                'message': str(e)
            }
        }), 400

    except VerificationError as e:
        logger.error('Verification error', error=str(e))
        return jsonify({
            'success': False,
            'error': {
                'type': 'verification_error',
                'message': str(e)
            }
        }), 500


@app.route('/api/health', methods=['GET'])
def api_health():
    """
    Health check endpoint.

    Returns:
        JSON with application status
    """
    return jsonify({
        'status': 'healthy',
        'version': current_config.APP_VERSION,
        'timestamp': datetime.now().isoformat()
    }), 200


# ===========================
# TEMPLATE CONTEXT
# ===========================

@app.context_processor
def inject_globals():
    """Inject global variables into all templates."""
    return {
        'app_name': current_config.APP_NAME,
        'app_version': current_config.APP_VERSION,
        'now': datetime.now()
    }


# ===========================
# APPLICATION ENTRY POINT
# ===========================

if __name__ == '__main__':
    # Log startup
    logger.info(
        'Starting Legal Verification Protocol',
        **current_config.get_info()
    )

    # Ensure upload folder exists
    import os
    os.makedirs(current_config.UPLOAD_FOLDER, exist_ok=True)

    # Run application
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=current_config.DEBUG
    )
