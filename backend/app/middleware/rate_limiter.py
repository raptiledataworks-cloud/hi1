"""Rate limiting utilities for protecting against brute-force attacks."""

from fastapi import Request, HTTPException, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import logging

logger = logging.getLogger(__name__)

# Initialize limiter
limiter = Limiter(key_func=get_remote_address)


async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> None:
    """Handle rate limit exceeded errors."""
    logger.warning(f"Rate limit exceeded for IP: {get_remote_address(request)}")
    raise HTTPException(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        detail="Too many requests. Please try again later."
    )
