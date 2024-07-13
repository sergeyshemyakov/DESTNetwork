import hashlib

from typing import List
from fastapi import APIRouter, Depends

from app import models
from app.dependencies import get_db
from app.schemas import submission

router = APIRouter()


@router.get("/submissions/", response_model=List[submission.Submission])
def list_submissions(submission_status: int | None = None, 
                     submission_id: str | None = None,
                     session=Depends(get_db)):
    items = session.query(models.Submission, models.Description)\
        .join(models.Description, models.Submission.description_hash==models.Description.hash)
    if submission_status:
        items = items.filter(models.Submission.status==submission_status)
    if submission_id:
        items = items.filter(models.Submission.submission_id==submission_id)
    return [submission.Submission(
        id=item.Submission.id,
        submission_id=item.Submission.submission_id,
        campaign_id=item.Submission.campaign_id,
        description=item.Description.content,
        photo_url=f"/api/photos/{item.Submission.photo_hash}",
        status=item.Description.status,
        lat=item.Submission.lat,
        long=item.Submission.long
    ) for item in items.all()]


@router.get("/submissions/{submission_id}", response_model=submission.Submission)
def get_submission(submission_id: int, session=Depends(get_db)):
    item = session.query(models.Submission, models.Description)\
        .join(models.Description, models.Submission.description_hash==models.Description.hash)\
        .filter(models.Submission.id==submission_id)\
        .first()
    
    return submission.Submission(
        id=item.Submission.id,
        submission_id=item.Submission.submission_id,
        campaign_id=item.Submission.campaign_id,
        description=item.Description.content,
        photo_url=f"/api/photos/{item.Submission.photo_hash}",
        status=item.Description.status,
        lat=item.Submission.lat,
        long=item.Submission.long
    )
