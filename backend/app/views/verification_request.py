import hashlib

from typing import List
from fastapi import APIRouter, Depends

from app import models
from app.dependencies import get_db
from app.schemas import verification_request

router = APIRouter()


@router.get("/verification-requests/", response_model=List[verification_request.VerificationRequest])
def list_verification_requests(verifier_id: str | None = None,
                               status: str | None = None,
                               session=Depends(get_db)):
    items = session.query(models.VerificationRequest)
    if verifier_id:
        items = items.filter(models.VerificationRequest.verifier_id==verifier_id)
    if status:
        items = items.filter(models.VerificationRequest.status==status)
    return items.all()


@router.get("/verification-requests/{verification_request_id}", response_model=verification_request.VerificationRequest)
def get_verification_request(verification_request_id: int, session=Depends(get_db)):
    item = session.query(models.VerificationRequest).get(verification_request_id)
    
    return item
