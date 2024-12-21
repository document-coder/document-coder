from .base import *  # noqa

# Read local .env file
env.read_env(BASE_DIR / ".env")

DEBUG = env.bool('DEBUG', default=True)  # Make sure we're using env.bool()

ALLOWED_HOSTS = [
  '127.0.0.1',
  'localhost',
  '0.0.0.0',
]
CSRF_TRUSTED_ORIGINS = [
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "http://0.0.0.0:8000",
]

# OAuth providers
SOCIALACCOUNT_PROVIDERS = {
  'google': {
    'APP': {
      'client_id': env('GOOGLE_CLIENT_ID'),
      'secret': env('GOOGLE_APP_SECRET'),
      'key': ''
    },
    'SCOPE': [
      'profile',
      'email',
    ],
    'AUTH_PARAMS': {
        'access_type': 'online',
    }

  }
}

DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.postgresql',
    'NAME': env('POSTGRES_DB', default='annotation_tool'),
    'USER': env('POSTGRES_USER', default='postgres'),
    'PASSWORD': env('POSTGRES_PASSWORD', default='postgres'),
    'HOST': env('POSTGRES_HOST', default='db'),  # matches the service name in docker-compose
    'PORT': env('POSTGRES_PORT', default='5432'),
  }
}

# VITE_DEV_SERVER=env('VITE_DEV_SERVER', default=None)

CORS_ALLOW_ALL_ORIGINS = True