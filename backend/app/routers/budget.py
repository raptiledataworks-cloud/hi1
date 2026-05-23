"""Budget router."""

from fastapi import APIRouter, Depends
from app.core.security import get_current_user

router = APIRouter(prefix="/budget", tags=["Budget"])


@router.get("/")
async def get_budget(current_user: dict = Depends(get_current_user)):
    """Get budget settings."""
    return {"budget": {}}


@router.put("/")
async def update_budget(current_user: dict = Depends(get_current_user)):
    """Update budget."""
    return {"message": "Coming soon"}