"""
Configuration Management for Legal Verification Protocol

Centralizes all configuration settings with environment-specific
configurations and validation.
"""

import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class ConfigurationError(Exception):
    """Raised when configuration is invalid or missing."""
    pass


class Config:
    """Base configuration class with common settings."""

    # Flask Core Settings
    SECRET_KEY: str = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key-CHANGE-IN-PRODUCTION')
    DEBUG: bool = False
    TESTING: bool = False

    # Application Settings
    APP_NAME: str = 'Legal Verification Protocol'
    APP_VERSION: str = '2.0.0'

    # File Upload Settings
    MAX_CONTENT_LENGTH: int = int(os.getenv('MAX_UPLOAD_SIZE', 16 * 1024 * 1024))  # 16MB default
    UPLOAD_FOLDER: str = 'uploads'
    ALLOWED_EXTENSIONS: set = {'txt', 'pdf', 'docx', 'doc'}

    # Anthropic API Settings
    ANTHROPIC_API_KEY: Optional[str] = os.getenv('ANTHROPIC_API_KEY')
    ANTHROPIC_MODEL: str = os.getenv('ANTHROPIC_MODEL', 'claude-sonnet-4-20250514')
    ANTHROPIC_MAX_TOKENS: int = int(os.getenv('ANTHROPIC_MAX_TOKENS', 16000))
    ANTHROPIC_THINKING_BUDGET: int = int(os.getenv('ANTHROPIC_THINKING_BUDGET', 10000))
    ANTHROPIC_TEMPERATURE: float = float(os.getenv('ANTHROPIC_TEMPERATURE', 0.2))

    # Rate Limiting Settings
    RATELIMIT_ENABLED: bool = os.getenv('RATELIMIT_ENABLED', 'true').lower() == 'true'
    RATELIMIT_DEFAULT: str = os.getenv('RATELIMIT_DEFAULT', '10 per hour')
    RATELIMIT_STORAGE_URL: str = os.getenv('RATELIMIT_STORAGE_URL', 'memory://')

    # Security Settings
    ENABLE_SECURITY_HEADERS: bool = os.getenv('ENABLE_SECURITY_HEADERS', 'true').lower() == 'true'
    FORCE_HTTPS: bool = os.getenv('FORCE_HTTPS', 'false').lower() == 'true'

    # Content Security Policy
    CSP_DIRECTIVES: dict = {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"],  # Inline scripts needed for current implementation
        'style-src': ["'self'", "'unsafe-inline'"],   # Inline styles needed
        'img-src': ["'self'", 'data:', 'https:'],
        'font-src': ["'self'", 'data:'],
        'connect-src': ["'self'"],
        'frame-ancestors': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"]
    }

    # Logging Settings
    LOG_LEVEL: str = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FORMAT: str = os.getenv('LOG_FORMAT', 'json')  # 'json' or 'console'

    # Session Settings
    SESSION_COOKIE_SECURE: bool = True
    SESSION_COOKIE_HTTPONLY: bool = True
    SESSION_COOKIE_SAMESITE: str = 'Lax'
    PERMANENT_SESSION_LIFETIME: int = 3600  # 1 hour

    @classmethod
    def validate(cls) -> None:
        """
        Validate critical configuration settings.

        Raises:
            ConfigurationError: If critical settings are missing or invalid.
        """
        errors = []

        # Validate API key
        if not cls.ANTHROPIC_API_KEY:
            errors.append('ANTHROPIC_API_KEY is required')

        # Validate secret key in production
        if not cls.DEBUG and cls.SECRET_KEY == 'dev-secret-key-CHANGE-IN-PRODUCTION':
            errors.append('FLASK_SECRET_KEY must be set to a secure value in production')

        # Validate upload folder exists
        if not os.path.exists(cls.UPLOAD_FOLDER):
            try:
                os.makedirs(cls.UPLOAD_FOLDER, exist_ok=True)
            except Exception as e:
                errors.append(f'Cannot create upload folder: {e}')

        if errors:
            raise ConfigurationError(
                'Configuration validation failed:\n' + '\n'.join(f'  - {e}' for e in errors)
            )

    @classmethod
    def get_info(cls) -> dict:
        """
        Get configuration information (safe for logging).

        Returns:
            dict: Configuration information without sensitive data.
        """
        return {
            'app_name': cls.APP_NAME,
            'app_version': cls.APP_VERSION,
            'debug': cls.DEBUG,
            'max_upload_size': f'{cls.MAX_CONTENT_LENGTH / (1024 * 1024):.0f}MB',
            'anthropic_model': cls.ANTHROPIC_MODEL,
            'rate_limiting': cls.RATELIMIT_ENABLED,
            'security_headers': cls.ENABLE_SECURITY_HEADERS,
            'log_level': cls.LOG_LEVEL
        }


class DevelopmentConfig(Config):
    """Development configuration."""

    DEBUG = True
    SESSION_COOKIE_SECURE = False  # Allow HTTP in development
    FORCE_HTTPS = False


class ProductionConfig(Config):
    """Production configuration."""

    DEBUG = False
    TESTING = False
    SESSION_COOKIE_SECURE = True
    FORCE_HTTPS = True

    # Stricter rate limiting in production
    RATELIMIT_DEFAULT = os.getenv('RATELIMIT_DEFAULT', '5 per hour')


class TestingConfig(Config):
    """Testing configuration."""

    TESTING = True
    DEBUG = True
    RATELIMIT_ENABLED = False  # Disable rate limiting in tests
    SESSION_COOKIE_SECURE = False


# Configuration mapping
config_by_name = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def get_config() -> Config:
    """
    Get configuration based on environment.

    Returns:
        Config: Configuration object for current environment.
    """
    env = os.getenv('FLASK_ENV', 'development').lower()
    config_class = config_by_name.get(env, DevelopmentConfig)

    # Validate configuration
    try:
        config_class.validate()
    except ConfigurationError as e:
        print(f'WARNING: Configuration validation failed: {e}')
        # In development, continue with warnings
        # In production, this should fail

    return config_class


# Export current config
current_config = get_config()
