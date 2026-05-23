"""Application constants."""

# Token expiry times (in minutes/days)
ACCESS_TOKEN_EXPIRE_MINUTES = 15  # 15 minutes
REFRESH_TOKEN_EXPIRE_DAYS = 7    # 7 days

# Rate limiting
RATE_LIMIT_LOGIN_ATTEMPTS = 5           # Max failed login attempts
RATE_LIMIT_LOGIN_WINDOW_MINUTES = 15    # Time window for rate limiting
RATE_LIMIT_SIGNUP_ATTEMPTS = 3          # Max signup attempts
RATE_LIMIT_SIGNUP_WINDOW_MINUTES = 60   # Time window for signup

# Password requirements
MIN_PASSWORD_LENGTH = 8
MAX_PASSWORD_LENGTH = 128

# Email requirements
MAX_EMAIL_LENGTH = 255
MAX_NAME_LENGTH = 100

# Categories
TRANSACTION_CATEGORIES = [
    "Food",
    "Transport",
    "Shopping",
    "Health",
    "Entertainment",
    "Utilities",
    "Education",
    "Other"
]

TRANSACTION_TYPES = ["income", "expense"]

ACCOUNT_TYPES = ["wallet", "bank", "upi", "investment"]
