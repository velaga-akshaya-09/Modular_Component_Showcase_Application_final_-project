import requests
from fastapi import HTTPException
from config.settings import SPRING_BOOT_URL

def _forward_request(path, payload):
    response = requests.post(
        f"{SPRING_BOOT_URL}{path}",
        json=payload,
        timeout=10,
    )

    if not response.ok:
        try:
            detail = response.json()
        except ValueError:
            detail = response.text
        raise HTTPException(status_code=response.status_code, detail=detail)

    return response.json()


def login_user(data):
    return _forward_request("/auth/login", data.dict())

def signup_user(data):
    return _forward_request("/auth/signup", data.dict())