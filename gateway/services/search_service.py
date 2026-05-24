import math
from datetime import datetime, timezone

import requests
from fastapi import HTTPException
from pymongo import MongoClient
from pymongo.errors import PyMongoError, ServerSelectionTimeoutError

from config.settings import MONGO_DATABASE, MONGO_URL, SPRING_BOOT_URL


DEMO_DESCRIPTIONS = [
    {
        "componentId": 1,
        "name": "Validated Email Form",
        "text": "Form validation component for reusable login signup email input validation inline errors required fields.",
    },
    {
        "componentId": 2,
        "name": "Role Aware Sidebar",
        "text": "Reusable navigation component for dashboards admin panels role based access sidebar menu.",
    },
    {
        "componentId": 3,
        "name": "Revenue Metric Card",
        "text": "Reusable dashboard widget metric card analytics chart KPI revenue trend reporting.",
    },
    {
        "componentId": 4,
        "name": "Async Toast Center",
        "text": "Feedback component for API loading success error toast notifications async operations.",
    },
]


def _headers(auth_header=None):
    return {"Authorization": auth_header} if auth_header else {}


def _embedding(text):
    vector = [0.0] * 32

    for token in text.lower().split():
        normalized = "".join(char for char in token if char.isalnum())
        if not normalized:
            continue

        token_hash = 0
        for char in normalized:
            token_hash = (token_hash * 31 + ord(char)) % 9973
        vector[token_hash % 32] += 1

    norm = math.sqrt(sum(value * value for value in vector))
    return [value / norm for value in vector] if norm else vector


def _cosine(left, right):
    return sum(a * b for a, b in zip(left, right))


def _mongo_db():
    client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=1200)
    client.admin.command("ping")
    return client[MONGO_DATABASE]


def _semantic_matches(query):
    query_embedding = _embedding(query)

    try:
        db = _mongo_db()
        descriptions = {
            item["componentId"]: item
            for item in db.component_descriptions.find({}, {"_id": 0})
        }
        embeddings = list(db.component_embeddings.find({}, {"_id": 0}))
    except (PyMongoError, ServerSelectionTimeoutError):
        descriptions = {item["componentId"]: item for item in DEMO_DESCRIPTIONS}
        embeddings = [
            {"componentId": item["componentId"], "embedding": _embedding(item["text"])}
            for item in DEMO_DESCRIPTIONS
        ]

    ranked = []
    for item in embeddings:
        description = descriptions.get(item["componentId"])
        if not description:
            continue
        ranked.append(
            {
                "componentId": item["componentId"],
                "score": round(_cosine(query_embedding, item["embedding"]), 4),
                "searchText": description["text"],
            }
        )

    return sorted(ranked, key=lambda item: item["score"], reverse=True)


def _fetch_component(component_id, auth_header=None):
    response = requests.get(
        f"{SPRING_BOOT_URL}/api/components/{component_id}",
        headers=_headers(auth_header),
        timeout=10,
    )

    if response.status_code == 404 or not response.text:
        return None

    if not response.ok:
        try:
            detail = response.json()
        except ValueError:
            detail = response.text
        raise HTTPException(status_code=response.status_code, detail=detail)

    return response.json()


def _log_search(query, user_email=None):
    try:
        db = _mongo_db()
        db.usage_logs.insert_one(
            {
                "query": query,
                "userEmail": user_email,
                "action": "semantic_search",
                "createdAt": datetime.now(timezone.utc),
            }
        )
    except (PyMongoError, ServerSelectionTimeoutError):
        return


def search_components(q, auth_header=None, user_email=None):
    matches = _semantic_matches(q)
    _log_search(q, user_email)

    results = []
    for match in matches[:8]:
        component = _fetch_component(match["componentId"], auth_header)
        if component:
            component["semanticScore"] = match["score"]
            component["semanticText"] = match["searchText"]
            results.append(component)

    return results
