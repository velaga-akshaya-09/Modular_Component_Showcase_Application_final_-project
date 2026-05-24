from fastapi import APIRouter, Header
from pydantic import BaseModel
from services.search_service import search_components

router = APIRouter(prefix="/gateway/search", tags=["Search"])

class SemanticSearchRequest(BaseModel):
    query: str
    userEmail: str | None = None

@router.get("")
def search(q: str, authorization: str | None = Header(default=None), x_user_email: str | None = Header(default=None)):
    return search_components(q, authorization, x_user_email)

@router.post("/semantic")
def semantic_search(data: SemanticSearchRequest, authorization: str | None = Header(default=None)):
    return search_components(data.query, authorization, data.userEmail)
