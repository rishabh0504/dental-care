from fastapi import APIRouter, HTTPException
from app.schemas.user import UserSignupRequest
from app.services.user_service import create_user
from prisma.errors import UniqueViolationError
from app.schemas.user import UserSigninRequest
from app.services.user_service import authenticate_user


router = APIRouter( tags=["Auth"])

@router.post("/signup")
async def signup(user: UserSignupRequest):
    try:
        new_user = await create_user(user)
        return {"id": new_user.id, "email": new_user.email, "message": "User created successfully"}
    except UniqueViolationError:
        raise HTTPException(status_code=400, detail="Email already exists")

@router.post("/signin")
async def signin(user: UserSigninRequest):
    auth_data = await authenticate_user(user)
    if not auth_data:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return auth_data