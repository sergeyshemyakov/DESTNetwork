import hashlib

from typing import List
from fastapi import APIRouter, Depends

from app import models
from app.schemas import description

router = APIRouter()

from app.dependencies import get_db

@router.get("/descriptions/{description_hash}", response_model=description.Description)
def get_description(description_hash: str, session=Depends(get_db)):
    return session.query(models.Description).get(description_hash)


@router.post("/descriptions")
def save_description(req: description.DescriptionRequest, session=Depends(get_db)) -> description.Description:
    description = models.Description(
        content=req.content,
        hash=hashlib.sha256(req.content)
    )
    session.add(description)
    session.commit()
    return description
