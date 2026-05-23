"""MIS router."""

from fastapi import APIRouter

router = APIRouter(prefix="/mis", tags=["MIS"])


@router.post("/cleanup")
async def cleanup():
    """MIS cleanup."""
    return {"message": "Cleanup completed"}