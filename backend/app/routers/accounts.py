"""Accounts router."""

from fastapi import APIRouter, Depends
from app.core.security import get_current_user

router = APIRouter(prefix="/accounts", tags=["Accounts"])


@router.get("/")
async def list_accounts(current_user: dict = Depends(get_current_user)):
    """List user accounts."""
    return {"accounts": []}


@router.post("/")
async def create_account(current_user: dict = Depends(get_current_user)):
    """Create account."""
    return {"message": "Coming soon"}