import requests
from fastapi import HTTPException
from config.settings import SPRING_BOOT_URL


def _headers(auth_header=None):
    return {"Authorization": auth_header} if auth_header else {}


def _forward_response(response):
    if not response.ok:
        try:
            detail = response.json()
        except ValueError:
            detail = response.text
        raise HTTPException(status_code=response.status_code, detail=detail)

    if response.status_code == 204 or not response.text:
        return None

    return response.json()


def get_categories(auth_header=None):
    response = requests.get(
        f"{SPRING_BOOT_URL}/api/categories",
        headers=_headers(auth_header),
        timeout=10,
    )
    return _forward_response(response)


def add_category(data, auth_header=None):
    response = requests.post(
        f"{SPRING_BOOT_URL}/api/categories",
        json=data.dict(),
        headers=_headers(auth_header),
        timeout=10,
    )
    return _forward_response(response)


def update_category(category_id, data, auth_header=None):
    response = requests.put(
        f"{SPRING_BOOT_URL}/api/categories/{category_id}",
        json=data.dict(),
        headers=_headers(auth_header),
        timeout=10,
    )
    return _forward_response(response)


def delete_category(category_id, auth_header=None):
    response = requests.delete(
        f"{SPRING_BOOT_URL}/api/categories/{category_id}",
        headers=_headers(auth_header),
        timeout=10,
    )
    return _forward_response(response)