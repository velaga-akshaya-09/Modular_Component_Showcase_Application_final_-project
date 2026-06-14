from fastapi import APIRouter, Request, Response
from models.schemas import LoginRequest, SignupRequest
from services.auth_service import login_user, signup_user
import requests
from config.settings import SPRING_BOOT_URL

router = APIRouter(prefix="/gateway/auth", tags=["Auth"])

@router.post("/login")
def login(data: LoginRequest):
    return login_user(data)

@router.post("/signup")
def signup(data: SignupRequest):
    return signup_user(data)

@router.get("/users")
def get_users(request: Request):
    headers = {}
    token = request.headers.get("authorization")
    if token:
        headers["Authorization"] = token
        
    res = requests.get(
        f"{SPRING_BOOT_URL}/auth/users",
        headers=headers
    )
    return Response(
        content=res.content,
        status_code=res.status_code,
        media_type=res.headers.get("content-type", "application/json")
    )