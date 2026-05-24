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

def add_component(data, auth_header=None):
    response = requests.post(
        f"{SPRING_BOOT_URL}/api/components",
        json=data.dict(),
        headers=_headers(auth_header),
        timeout=10,
    )
    return _forward_response(response)

def get_components(auth_header=None):
    response = requests.get(
        f"{SPRING_BOOT_URL}/api/components",
        headers=_headers(auth_header),
        timeout=10,
    )
    return _forward_response(response)

def request_component(data, auth_header=None):
    response = requests.post(
        f"{SPRING_BOOT_URL}/api/components/requests",
        json=data.dict(),
        headers=_headers(auth_header),
        timeout=10,
    )
    return _forward_response(response)

def get_component_requests(requested_by=None, auth_header=None):
    params = {"requestedBy": requested_by} if requested_by else None
    response = requests.get(
        f"{SPRING_BOOT_URL}/api/components/requests",
        params=params,
        headers=_headers(auth_header),
        timeout=10,
    )
    return _forward_response(response)

def accept_component_request(request_id, auth_header=None):
    response = requests.post(
        f"{SPRING_BOOT_URL}/api/components/requests/{request_id}/accept",
        headers=_headers(auth_header),
        timeout=10,
    )
    return _forward_response(response)

def reject_component_request(request_id, auth_header=None):
    response = requests.post(
        f"{SPRING_BOOT_URL}/api/components/requests/{request_id}/reject",
        headers=_headers(auth_header),
        timeout=10,
    )
    return _forward_response(response)

def search_components(q, auth_header=None):
    response = requests.get(
        f"{SPRING_BOOT_URL}/api/components/search",
        params={"q": q},
        headers=_headers(auth_header),
        timeout=10,
    )
    return _forward_response(response)

def get_component_by_id(component_id, auth_header=None):
    response = requests.get(
        f"{SPRING_BOOT_URL}/api/components/{component_id}",
        headers=_headers(auth_header),
        timeout=10,
    )
    return _forward_response(response)

def update_component(component_id, data, auth_header=None):
    response = requests.put(
        f"{SPRING_BOOT_URL}/api/components/{component_id}",
        json=data.dict(),
        headers=_headers(auth_header),
        timeout=10,
    )
    return _forward_response(response)

def delete_component(component_id, auth_header=None):
    response = requests.delete(
        f"{SPRING_BOOT_URL}/api/components/{component_id}",
        headers=_headers(auth_header),
        timeout=10,
    )
    if not response.ok:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return {"message": response.text}