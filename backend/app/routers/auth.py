"""Authentication endpoints - MongoDB only, secure token system."""

from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends, Request
from pydantic import BaseModel, EmailStr
import logging

from app.config import settings
from app import database
from app.models import UserCreate, UserLogin
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    verify_token,
    get_current_user,
)
from app.core.errors import AuthenticationError, ValidationError

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Auth"])


class TokenResponse(BaseModel):
    """Token response with access and refresh tokens."""
    access_token: str
    refresh_token: str
    token_type: str
    user_name: str


class UserUpdate(BaseModel):
    """User profile update."""
    name: str
    phone: str = ""
    dob: str = ""
    gender: str = ""
    address: str = ""
    city: str = ""
    state: str = ""
    pincode: str = ""


class PasswordUpdate(BaseModel):
    """Password change request."""
    current_password: str
    new_password: str


class RefreshTokenRequest(BaseModel):
    """Refresh token request."""
    refresh_token: str


# ============================================================================
# SIGNUP
# ============================================================================

@router.post("/signup", response_model=TokenResponse)
async def signup(user: UserCreate, request: Request):
    """Register a new user - SECURE: No plain-text password storage."""
    
    if database.users_collection is None:
        logger.error("❌ Database connection failed - users_collection is None")
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        # Check if email already exists
        existing = await database.users_collection.find_one({"email": user.email})
        if existing:
            logger.warning(f"⚠️ Signup attempted with existing email: {user.email}")
            raise ValidationError("Email already registered")
        
        # Hash password (ONLY hash - NO plain-text storage)
        hashed_pw = get_password_hash(user.password)
        
        # Create user document
        user_doc = {
            "name": user.name,
            "email": user.email,
            "hashed_password": hashed_pw,  # ✅ ONLY hashed password
            "is_verified": False,
            "phone": "",
            "dob": "",
            "gender": "",
            "address": "",
            "city": "",
            "state": "",
            "pincode": "",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        
        result = await database.users_collection.insert_one(user_doc)
        
        # Create tokens
        access_token = create_access_token(data={"sub": user.email})
        refresh_token = create_refresh_token(data={"sub": user.email})
        
        logger.info(f"✅ User registered: {user.email}")
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user_name=user.name
        )
    
    except ValidationError:
        raise
    except Exception as e:
        logger.error(f"❌ Signup error: {str(e)}")
        raise HTTPException(status_code=500, detail="Registration failed")


# ============================================================================
# LOGIN
# ============================================================================

@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin, request: Request):
    """Authenticate user - Returns short-lived access + long-lived refresh tokens."""
    
    if database.users_collection is None:
        logger.error("❌ Database connection failed - users_collection is None")
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        # Find user by email
        user = await database.users_collection.find_one({"email": user_data.email})
        if not user:
            logger.warning(f"⚠️ Login attempt with non-existent email: {user_data.email}")
            raise AuthenticationError("Invalid email or password")
        
        # Verify password
        if not verify_password(user_data.password, user["hashed_password"]):
            logger.warning(f"⚠️ Failed login attempt for: {user_data.email}")
            raise AuthenticationError("Invalid email or password")
        
        # Create tokens
        access_token = create_access_token(data={"sub": user["email"]})
        refresh_token = create_refresh_token(data={"sub": user["email"]})
        
        # Update last login
        await database.users_collection.update_one(
            {"_id": user["_id"]},
            {"$set": {"updated_at": datetime.utcnow()}}
        )
        
        logger.info(f"✅ User logged in: {user_data.email}")
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user_name=user["name"]
        )
    
    except AuthenticationError:
        raise
    except Exception as e:
        logger.error(f"❌ Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed")


# ============================================================================
# REFRESH TOKEN
# ============================================================================

@router.post("/refresh", response_model=TokenResponse)
async def refresh_access_token(request: RefreshTokenRequest):
    """Use refresh token to get new access token without re-logging in."""
    
    if database.users_collection is None:
        raise HTTPException(status_code=500, detail="Database error")
    
    try:
        payload = verify_token(request.refresh_token, token_type="refresh")
        email = payload.get("sub")
        
        user = await database.users_collection.find_one({"email": email})
        if not user:
            raise AuthenticationError("User not found")
        
        # Create new access token
        new_access_token = create_access_token(data={"sub": email})
        
        logger.info(f"✅ Token refreshed for: {email}")
        
        return TokenResponse(
            access_token=new_access_token,
            refresh_token=request.refresh_token,
            token_type="bearer",
            user_name=user["name"]
        )
    
    except AuthenticationError:
        raise
    except Exception as e:
        logger.error(f"❌ Token refresh error: {str(e)}")
        raise AuthenticationError("Invalid or expired refresh token")


# ============================================================================
# GET CURRENT USER
# ============================================================================

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user profile."""
    
    if database.users_collection is None:
        raise HTTPException(status_code=500, detail="Database error")
    
    try:
        user = await database.users_collection.find_one({"_id": current_user["_id"]})
        if not user:
            raise AuthenticationError("User not found")
        
        # Remove sensitive fields
        user.pop("_id", None)
        user.pop("hashed_password", None)
        
        return user
    
    except Exception as e:
        logger.error(f"❌ Get user error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch user")


# ============================================================================
# UPDATE PROFILE
# ============================================================================

@router.put("/profile")
async def update_profile(data: UserUpdate, current_user: dict = Depends(get_current_user)):
    """Update user profile information."""
    
    if database.users_collection is None:
        raise HTTPException(status_code=500, detail="Database error")
    
    try:
        update_data = data.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        await database.users_collection.update_one(
            {"_id": current_user["_id"]},
            {"$set": update_data}
        )
        
        logger.info(f"✅ Profile updated for: {current_user['email']}")
        
        return {"message": "Profile updated successfully"}
    
    except Exception as e:
        logger.error(f"❌ Profile update error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update profile")


# ============================================================================
# CHANGE PASSWORD
# ============================================================================

@router.put("/password")
async def change_password(data: PasswordUpdate, current_user: dict = Depends(get_current_user)):
    """Change user password."""
    
    if database.users_collection is None:
        raise HTTPException(status_code=500, detail="Database error")
    
    try:
        # Fetch user
        user = await database.users_collection.find_one({"_id": current_user["_id"]})
        if not user:
            raise AuthenticationError("User not found")
        
        # Verify current password
        if not verify_password(data.current_password, user["hashed_password"]):
            logger.warning(f"⚠️ Failed password change attempt for: {current_user['email']}")
            raise AuthenticationError("Current password is incorrect")
        
        # Hash new password
        new_hashed = get_password_hash(data.new_password)
        
        # Update password
        await database.users_collection.update_one(
            {"_id": current_user["_id"]},
            {"$set": {"hashed_password": new_hashed, "updated_at": datetime.utcnow()}}
        )
        
        logger.info(f"✅ Password changed for: {current_user['email']}")
        
        return {"message": "Password updated successfully"}
    
    except AuthenticationError:
        raise
    except Exception as e:
        logger.error(f"❌ Password change error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to change password")


# ============================================================================
# DELETE ACCOUNT
# ============================================================================

@router.delete("/me")
async def delete_account(current_user: dict = Depends(get_current_user)):
    """Delete user account and all associated data."""
    
    if database.users_collection is None:
        raise HTTPException(status_code=500, detail="Database error")
    
    try:
        user_id = current_user["_id"]
        email = current_user["email"]
        
        # Delete user
        await database.users_collection.delete_one({"_id": user_id})
        
        # Delete all associated data
        await database.transactions_collection.delete_many({"user_id": str(user_id)})
        await database.accounts_collection.delete_many({"user_id": str(user_id)})
        await database.goals_collection.delete_many({"user_id": str(user_id)})
        await database.habits_collection.delete_many({"user_id": str(user_id)})
        await database.budget_settings_collection.delete_many({"user_id": str(user_id)})
        
        logger.info(f"✅ Account deleted for: {email}")
        
        return {"message": "Account successfully deleted"}
    
    except Exception as e:
        logger.error(f"❌ Account deletion error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete account")