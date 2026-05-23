"""Excel export router."""

from fastapi import APIRouter, Depends
from app.core.security import get_current_user

router = APIRouter(prefix="/export", tags=["Export"])


@router.get("/pdf")
async def export_pdf(current_user: dict = Depends(get_current_user)):
    """Export to PDF."""
    return {"message": "Coming soon"}