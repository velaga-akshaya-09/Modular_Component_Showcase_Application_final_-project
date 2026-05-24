from fastapi import APIRouter, Request, Response
from pymongo import MongoClient
from pymongo.errors import PyMongoError, ServerSelectionTimeoutError
import requests
from config.settings import MONGO_DATABASE, MONGO_URL

router = APIRouter()

BACKEND_URL = "http://localhost:8000"


def forward_headers(request: Request):
    token = request.headers.get("authorization")
    headers = {}

    if token:
        headers["Authorization"] = token

    return headers


def delete_component_search_records(component_id: int):
    try:
        client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=1200)
        client.admin.command("ping")
        db = client[MONGO_DATABASE]
        db.component_descriptions.delete_many({"componentId": component_id})
        db.component_embeddings.delete_many({"componentId": component_id})
    except (PyMongoError, ServerSelectionTimeoutError):
        return


@router.get("/components")
def get_components(request: Request):
    res = requests.get(
        f"{BACKEND_URL}/api/components",
        headers=forward_headers(request)
    )

    return Response(
        content=res.content,
        status_code=res.status_code,
        media_type=res.headers.get("content-type", "application/json")
    )


@router.get("/categories")
def get_categories(request: Request):
    res = requests.get(
        f"{BACKEND_URL}/api/categories",
        headers=forward_headers(request)
    )

    return Response(
        content=res.content,
        status_code=res.status_code,
        media_type=res.headers.get("content-type", "application/json")
    )


@router.get("/components/requests")
def get_component_requests(request: Request):
    res = requests.get(
        f"{BACKEND_URL}/api/components/requests",
        params=request.query_params,
        headers=forward_headers(request)
    )

    return Response(
        content=res.content,
        status_code=res.status_code,
        media_type=res.headers.get("content-type", "application/json")
    )


@router.get("/components/search")
def search_components(q: str, request: Request):
    res = requests.get(
        f"{BACKEND_URL}/api/components/search",
        params={"q": q},
        headers=forward_headers(request)
    )

    return Response(
        content=res.content,
        status_code=res.status_code,
        media_type=res.headers.get("content-type", "application/json")
    )


@router.post("/components/requests")
async def create_component_request(request: Request):
    data = await request.json()

    res = requests.post(
        f"{BACKEND_URL}/api/components/requests",
        json=data,
        headers=forward_headers(request)
    )

    return Response(
        content=res.content,
        status_code=res.status_code,
        media_type=res.headers.get("content-type", "application/json")
    )


@router.post("/components")
async def add_component(request: Request):
    data = await request.json()

    res = requests.post(
        f"{BACKEND_URL}/api/components",
        json=data,
        headers=forward_headers(request)
    )

    return Response(
        content=res.content,
        status_code=res.status_code,
        media_type=res.headers.get("content-type", "application/json")
    )


@router.get("/components/{component_id}")
def get_component(component_id: int, request: Request):
    res = requests.get(
        f"{BACKEND_URL}/api/components/{component_id}",
        headers=forward_headers(request)
    )

    return Response(
        content=res.content,
        status_code=res.status_code,
        media_type=res.headers.get("content-type", "application/json")
    )


@router.delete("/components/{component_id}")
def delete_component(component_id: int, request: Request):
    res = requests.delete(
        f"{BACKEND_URL}/api/components/{component_id}",
        headers=forward_headers(request)
    )

    if res.ok:
        delete_component_search_records(component_id)

    return Response(
        content=res.content,
        status_code=res.status_code,
        media_type=res.headers.get("content-type", "application/json")
    )


@router.post("/components/requests/{request_id}/accept")
def accept_request(request_id: int, request: Request):
    res = requests.post(
        f"{BACKEND_URL}/api/components/requests/{request_id}/accept",
        headers=forward_headers(request)
    )

    return Response(
        content=res.content,
        status_code=res.status_code,
        media_type=res.headers.get("content-type", "application/json")
    )


@router.post("/components/requests/{request_id}/reject")
def reject_request(request_id: int, request: Request):
    res = requests.post(
        f"{BACKEND_URL}/api/components/requests/{request_id}/reject",
        headers=forward_headers(request)
    )

    return Response(
        content=res.content,
        status_code=res.status_code,
        media_type=res.headers.get("content-type", "application/json")
    )
