"""Global error handling middleware."""

from fastapi import Request
from fastapi.responses import JSONResponse
from app.core.errors import AuthenticationError, ValidationError, NotFoundError, ForbiddenError
import logging
import traceback

logger = logging.getLogger(__name__)


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle all uncaught exceptions."""
    
    # Custom exceptions
    if isinstance(exc, (AuthenticationError, ValidationError, NotFoundError, ForbiddenError)):
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "error": {"message": exc.detail}}
        )
    
    # Generic exceptions - log and return safe error
    logger.error(f"Unhandled exception: {str(exc)}\n{traceback.format_exc()}")
    
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": {"message": "Internal server error"}}
    )
