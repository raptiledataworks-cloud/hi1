"""Goals router."""

from fastapi import APIRouter, Depends
from app.core.security import get_current_user

router = APIRouter(prefix="/goals", tags=["Goals"])


@router.get("/")
async def list_goals(current_user: dict = Depends(get_current_user)):
    """List user goals."""
    return {"goals": []}


@router.post("/")
async def create_goal(current_user: dict = Depends(get_current_user)):
    """Create goal."""
    return {"message": "Coming soon"}