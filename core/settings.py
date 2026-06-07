from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# =========================
# SECURITY
# =========================

SECRET_KEY = 'django-insecure-*2wq^6x3$7&+q)twt3d2e5fwryo74'

DEBUG = False

ALLOWED_HOSTS = [
    "lms-backend-n36s.onrender.com",
]

# =========================
# APPLICATIONS 
# =========================

INSTALLED_APPS = [
    "corsheaders",

    "rest_framework",
    "rest_framework_simplejwt",

    "users",
    "assignment",
    "submissions",

    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

# =========================
# MIDDLEWARE
# =========================

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",

    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

# =========================
# TEMPLATES
# =========================

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"

# =========================
# DATABASE
# =========================

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# =========================
# PASSWORD VALIDATION
# =========================

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# =========================
# INTERNATIONALIZATION
# =========================

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# =========================
# STATIC FILES (Render compatible)
# =========================

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# =========================
# DEFAULT PRIMARY KEY
# =========================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# =========================
# REST FRAMEWORK (JWT)
# =========================

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    )
}

# =========================
# CUSTOM USER MODEL
# =========================

AUTH_USER_MODEL = "users.User"

# =========================
# CORS (CRITICAL FIX)
# =========================

CORS_ALLOWED_ORIGINS = [
    "https://own-lms.vercel.app",
    "https://learning-management-system-mid81vrcl-sohaibnisars-projects.vercel.app"
] 

CORS_ALLOW_CREDENTIALS = True