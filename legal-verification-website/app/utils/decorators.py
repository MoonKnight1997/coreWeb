"""
Decorators for Legal Verification Protocol

Provides decorators for rate limiting, error handling, and request logging.
"""

from functools import wraps
from flask import request, jsonify
from app.utils.logger import logger, log_error, log_rate_limit_exceeded
from app.config import current_config
import time


def handle_errors(f):
    """
    Decorator to handle errors gracefully and return structured responses.

    Usage:
        @app.route('/api/endpoint')
        @handle_errors
        def endpoint():
            ...
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ValueError as e:
            # Client errors (bad input)
            log_error(e, {'endpoint': request.endpoint, 'type': 'validation_error'})
            return jsonify({
                'success': False,
                'error': {
                    'type': 'validation_error',
                    'message': str(e)
                }
            }), 400
        except FileNotFoundError as e:
            log_error(e, {'endpoint': request.endpoint, 'type': 'not_found'})
            return jsonify({
                'success': False,
                'error': {
                    'type': 'not_found',
                    'message': 'Resource not found'
                }
            }), 404
        except PermissionError as e:
            log_error(e, {'endpoint': request.endpoint, 'type': 'forbidden'})
            return jsonify({
                'success': False,
                'error': {
                    'type': 'forbidden',
                    'message': 'Access denied'
                }
            }), 403
        except Exception as e:
            # Server errors
            log_error(e, {'endpoint': request.endpoint, 'type': 'internal_error'})

            # Don't expose internal error details in production
            if current_config.DEBUG:
                error_message = str(e)
            else:
                error_message = 'An internal error occurred. Please try again later.'

            return jsonify({
                'success': False,
                'error': {
                    'type': 'internal_error',
                    'message': error_message
                }
            }), 500

    return decorated_function


def log_request_info(f):
    """
    Decorator to log request information.

    Usage:
        @app.route('/api/endpoint')
        @log_request_info
        def endpoint():
            ...
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        start_time = time.time()

        logger.info(
            'Request started',
            method=request.method,
            path=request.path,
            ip=request.remote_addr,
            endpoint=request.endpoint
        )

        result = f(*args, **kwargs)

        duration_ms = (time.time() - start_time) * 1000

        # Extract status code from response
        if isinstance(result, tuple):
            status_code = result[1] if len(result) > 1 else 200
        else:
            status_code = 200

        logger.info(
            'Request completed',
            method=request.method,
            path=request.path,
            status=status_code,
            duration_ms=round(duration_ms, 2),
            endpoint=request.endpoint
        )

        return result

    return decorated_function


def validate_file_upload(f):
    """
    Decorator to validate file uploads.

    Checks:
    - File exists in request
    - File has allowed extension
    - File size is within limits

    Usage:
        @app.route('/api/upload', methods=['POST'])
        @validate_file_upload
        def upload():
            file = request.files['file']
            ...
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check if file exists
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'error': {
                    'type': 'validation_error',
                    'message': 'No file provided'
                }
            }), 400

        file = request.files['file']

        # Check if file was selected
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': {
                    'type': 'validation_error',
                    'message': 'No file selected'
                }
            }), 400

        # Check file extension
        if '.' not in file.filename:
            return jsonify({
                'success': False,
                'error': {
                    'type': 'validation_error',
                    'message': 'File has no extension'
                }
            }), 400

        ext = file.filename.rsplit('.', 1)[1].lower()
        if ext not in current_config.ALLOWED_EXTENSIONS:
            return jsonify({
                'success': False,
                'error': {
                    'type': 'validation_error',
                    'message': f'File type .{ext} not allowed. Allowed types: {", ".join(current_config.ALLOWED_EXTENSIONS)}'
                }
            }), 400

        return f(*args, **kwargs)

    return decorated_function


def require_terms_acceptance(f):
    """
    Decorator to ensure terms have been accepted.

    Usage:
        @app.route('/api/verify', methods=['POST'])
        @require_terms_acceptance
        def verify():
            ...
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        terms_accepted = request.form.get('terms_accepted')

        if not terms_accepted or terms_accepted.lower() != 'true':
            return jsonify({
                'success': False,
                'error': {
                    'type': 'validation_error',
                    'message': 'You must accept the terms and legal disclaimer to proceed'
                }
            }), 400

        return f(*args, **kwargs)

    return decorated_function


def measure_time(f):
    """
    Decorator to measure function execution time.

    Usage:
        @measure_time
        def slow_function():
            ...
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        start_time = time.time()
        result = f(*args, **kwargs)
        duration_ms = (time.time() - start_time) * 1000

        logger.debug(
            f'{f.__name__} execution time',
            function=f.__name__,
            duration_ms=round(duration_ms, 2)
        )

        return result

    return decorated_function
