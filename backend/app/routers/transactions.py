"""Transactions router."""

from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("/")
async def list_transactions(current_user: dict = Depends(get_current_user)):
    """List user transactions."""
    return {"transactions": [], "message": "Coming soon"}


@router.post("/")
async def create_transaction(current_user: dict = Depends(get_current_user)):
    """Create transaction."""
    return {"message": "Coming soon"}