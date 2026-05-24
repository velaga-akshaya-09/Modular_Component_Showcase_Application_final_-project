from fastapi import APIRouter
from models.schemas import LoginRequest, SignupRequest
from services.auth_service import login_user, signup_user

router = APIRouter(prefix="/gateway/auth", tags=["Auth"])

@router.post("/login")
def login(data: LoginRequest):
    return login_user(data)

@router.post("/signup")
def signup(data: SignupRequest):
    return signup_user(data)