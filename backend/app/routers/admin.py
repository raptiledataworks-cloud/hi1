"""Admin router."""

from fastapi import APIRouter, Depends
from app.core.security import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users")
async def list_users(current_user: dict = Depends(get_current_user)):
    """List all users (admin only)."""
    return {"users": []}


@router.get("/users/{user_id}/data")
async def get_user_data(user_id: str, current_user: dict = Depends(get_current_user)):
    """Get specific user data (admin only)."""
    return {"user_data": {}}