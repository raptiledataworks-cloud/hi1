"""AI coach router."""

from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.models import ChatInput, NaturalLanguageInput

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/chat")
async def chat(message: ChatInput, current_user: dict = Depends(get_current_user)):
    """Chat with AI coach."""
    return {"response": "Coming soon"}


@router.post("/insights")
async def insights(data: NaturalLanguageInput, current_user: dict = Depends(get_current_user)):
    """Get AI insights."""
    return {"insights": "Coming soon"}