"""
Structured Logging Setup for Legal Verification Protocol

Provides structured logging using structlog with JSON output for production
and console output for development.
"""

import logging
import sys
from typing import Any, Dict
import structlog
from app.config import current_config


def setup_logging() -> structlog.BoundLogger:
    """
    Configure structured logging.

    Returns:
        structlog.BoundLogger: Configured logger instance.
    """
    # Determine log level
    log_level = getattr(logging, current_config.LOG_LEVEL.upper(), logging.INFO)

    # Configure standard library logging
    logging.basicConfig(
        format='%(message)s',
        stream=sys.stdout,
        level=log_level
    )

    # Shared processors for all environments
    shared_processors = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_log_level,
        structlog.stdlib.add_logger_name,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
    ]

    # Environment-specific rendering
    if current_config.LOG_FORMAT == 'json':
        # JSON output for production
        processors = shared_processors + [
            structlog.processors.JSONRenderer()
        ]
    else:
        # Console output for development
        processors = shared_processors + [
            structlog.dev.ConsoleRenderer(colors=True)
        ]

    # Configure structlog
    structlog.configure(
        processors=processors,
        wrapper_class=structlog.stdlib.BoundLogger,
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )

    return structlog.get_logger()


# Global logger instance
logger = setup_logging()


def log_request(request, response_status: int = None, **kwargs) -> None:
    """
    Log HTTP request with structured data.

    Args:
        request: Flask request object
        response_status: HTTP response status code
        **kwargs: Additional context to log
    """
    log_data = {
        'event': 'http_request',
        'method': request.method,
        'path': request.path,
        'ip': request.remote_addr,
        'user_agent': request.headers.get('User-Agent', 'Unknown'),
        **kwargs
    }

    if response_status:
        log_data['status'] = response_status

    logger.info('HTTP Request', **log_data)


def log_error(error: Exception, context: Dict[str, Any] = None) -> None:
    """
    Log error with full context.

    Args:
        error: Exception that occurred
        context: Additional context information
    """
    log_data = {
        'event': 'error',
        'error_type': type(error).__name__,
        'error_message': str(error),
    }

    if context:
        log_data.update(context)

    logger.error('Application Error', **log_data, exc_info=True)


def log_verification_start(document_type: str, file_size: int = None, **kwargs) -> None:
    """
    Log verification start event.

    Args:
        document_type: Type of document being verified
        file_size: Size of file in bytes
        **kwargs: Additional context
    """
    log_data = {
        'event': 'verification_start',
        'document_type': document_type,
    }

    if file_size:
        log_data['file_size_mb'] = round(file_size / (1024 * 1024), 2)

    log_data.update(kwargs)

    logger.info('Verification Started', **log_data)


def log_verification_complete(document_type: str, duration_ms: float, success: bool = True, **kwargs) -> None:
    """
    Log verification completion.

    Args:
        document_type: Type of document verified
        duration_ms: Duration in milliseconds
        success: Whether verification succeeded
        **kwargs: Additional context
    """
    log_data = {
        'event': 'verification_complete',
        'document_type': document_type,
        'duration_ms': round(duration_ms, 2),
        'success': success,
    }

    log_data.update(kwargs)

    if success:
        logger.info('Verification Completed', **log_data)
    else:
        logger.warning('Verification Failed', **log_data)


def log_rate_limit_exceeded(ip: str, endpoint: str, **kwargs) -> None:
    """
    Log rate limit violation.

    Args:
        ip: IP address that exceeded limit
        endpoint: Endpoint that was rate limited
        **kwargs: Additional context
    """
    log_data = {
        'event': 'rate_limit_exceeded',
        'ip': ip,
        'endpoint': endpoint,
    }

    log_data.update(kwargs)

    logger.warning('Rate Limit Exceeded', **log_data)
