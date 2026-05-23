"""Habits router."""

from fastapi import APIRouter, Depends
from app.core.security import get_current_user

router = APIRouter(prefix="/habits", tags=["Habits"])


@router.get("/")
async def list_habits(current_user: dict = Depends(get_current_user)):
    """List user habits."""
    return {"habits": []}


@router.post("/")
async def create_habit(current_user: dict = Depends(get_current_user)):
    """Create habit."""
    return {"message": "Coming soon"}