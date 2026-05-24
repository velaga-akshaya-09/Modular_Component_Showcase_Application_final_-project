from fastapi import APIRouter, Header
from models.schemas import CategoryRequest
from services.category_service import (
    add_category,
    delete_category,
    get_categories,
    update_category,
)

router = APIRouter(prefix="/gateway/categories", tags=["Categories"])


@router.get("")
def fetch_categories(authorization: str | None = Header(default=None)):
    return get_categories(authorization)


@router.post("")
def create_category(data: CategoryRequest, authorization: str | None = Header(default=None)):
    return add_category(data, authorization)


@router.put("/{category_id}")
def edit_category(category_id: int, data: CategoryRequest, authorization: str | None = Header(default=None)):
    return update_category(category_id, data, authorization)


@router.delete("/{category_id}")
def remove_category(category_id: int, authorization: str | None = Header(default=None)):
    return delete_category(category_id, authorization)