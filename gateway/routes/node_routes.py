from fastapi import APIRouter, Request, Response
import requests

router = APIRouter()

NODE_URL = "http://localhost:5000"


def forward_headers(request: Request):
    token = request.headers.get("authorization")
    headers = {}

    if token:
        headers["Authorization"] = token

    return headers


@router.get("/reviews")
def get_reviews(request: Request):
    res = requests.get(
        f"{NODE_URL}/api/reviews",
        params=request.query_params,
        headers=forward_headers(request)
    )
    return Response(
        content=res.content,
        status_code=res.status_code,
        media_type=res.headers.get("content-type", "application/json")
    )


@router.post("/reviews")
async def create_review(request: Request):
    data = await request.json()
    res = requests.post(
        f"{NODE_URL}/api/reviews",
        json=data,
        headers=forward_headers(request)
    )
    return Response(
        content=res.content,
        status_code=res.status_code,
        media_type=res.headers.get("content-type", "application/json")
    )


@router.put("/reviews/{review_id}")
async def update_review(review_id: int, request: Request):
    data = await request.json()
    res = requests.put(
        f"{NODE_URL}/api/reviews/{review_id}",
        json=data,
        headers=forward_headers(request)
    )
    return Response(
        content=res.content,
        status_code=res.status_code,
        media_type=res.headers.get("content-type", "application/json")
    )


@router.delete("/reviews/{review_id}")
def delete_review(review_id: int, request: Request):
    res = requests.delete(
        f"{NODE_URL}/api/reviews/{review_id}",
        headers=forward_headers(request)
    )
    return Response(
        content=res.content,
        status_code=res.status_code,
        media_type=res.headers.get("content-type", "application/json")
    )


@router.get("/favorites")
def get_favorites(request: Request):
    res = requests.get(
        f"{NODE_URL}/api/favorites",
        headers=forward_headers(request)
    )
    return Response(
        content=res.content,
        status_code=res.status_code,
        media_type=res.headers.get("content-type", "application/json")
    )


@router.post("/favorites")
async def add_favorite(request: Request):
    data = await request.json()
    res = requests.post(
        f"{NODE_URL}/api/favorites",
        json=data,
        headers=forward_headers(request)
    )
    return Response(
        content=res.content,
        status_code=res.status_code,
        media_type=res.headers.get("content-type", "application/json")
    )


@router.delete("/favorites/component/{component_id}")
def remove_favorite(component_id: int, request: Request):
    res = requests.delete(
        f"{NODE_URL}/api/favorites/component/{component_id}",
        headers=forward_headers(request)
    )
    return Response(
        content=res.content,
        status_code=res.status_code,
        media_type=res.headers.get("content-type", "application/json")
    )
