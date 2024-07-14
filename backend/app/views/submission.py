import hashlib

from typing import List
from fastapi import APIRouter, Depends

from app import models
from app.dependencies import get_db
from app.schemas import submission

router = APIRouter()


@router.get("/submissions", response_model=List[submission.Submission])
def list_submissions(campaign_id: str,
                     user_address: str,
                     submission_status: int | None = None, 
                     submission_creator_address: str | None = None,
                     session=Depends(get_db)):
    items = session.query(models.Submission, models.Description)\
        .join(models.Description, models.Submission.description_hash==models.Description.hash)\
        .filter(models.Submission.campaign_id==campaign_id)
    submissions_to_verify = [
        x.submission_id for x in session.query(models.VerificationRequest).filter(models.VerificationRequest.verifier_id==user_address).all()] 
    print(submissions_to_verify)
    if submission_status:
        items = items.filter(models.Submission.status==submission_status)
    if submission_creator_address:
        items = items.filter(models.Submission.submission_id==submission_creator_address)
    return [submission.Submission(
        id=item.Submission.id,
        submission_id=item.Submission.submission_id,
        campaign_id=item.Submission.campaign_id,
        description=item.Description.content,
        photo_url=f"/api/photos/{item.Submission.photo_hash}",
        status=item.Submission.status,
        lat=item.Submission.lat,
        long=item.Submission.long,
        resolved=item.Submission.resolved or False,
        state=submission.Submission.calc_state(
            item.Submission.submission_id in submissions_to_verify,
            item.Submission.status,
            item.Submission.resolved
        )
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
        status=item.Submission.status,
        lat=item.Submission.lat,
        long=item.Submission.long
    )


@router.get("/submissions/verify/{verificator_id}", response_model=List[submission.Submission])
def get_submissions_to_verify(verificator_id: str, 
                   campaign_id: str | None = None,
                   blockchain: str | None = None,
                   session=Depends(get_db)):
    items = session.query(models.Submission, models.Description, models.VerificationRequest)\
        .join(models.Description, models.Submission.description_hash==models.Description.hash)\
        .join(models.VerificationRequest, models.Submission.submission_id==models.VerificationRequest.submission_id)\
        .filter(models.VerificationRequest.verifier_id==verificator_id)
    if campaign_id:
        items = items.filter(models.Submission.campaign_id==campaign_id)
    if blockchain:
        items = items.join(models.StashCampaign, models.Submission.campaign_id==models.StashCampaign.campaign_id)\
                     .filter(models.StashCampaign.blockchain==blockchain)
    
    return [submission.Submission(
        id=item.Submission.id,
        submission_id=item.Submission.submission_id,
        campaign_id=item.Submission.campaign_id,
        description=item.Description.content,
        photo_url=f"/api/photos/{item.Submission.photo_hash}",
        status=item.Submission.status,
        lat=item.Submission.lat,
        long=item.Submission.long
    ) for item in items.all()]


@router.post('/submissions', response_model=submission.Submission)
def create_submission(req: submission.SubmissionRequest, session=Depends(get_db)):
    submission_model = models.Submission(
        submission_id=req.submission_id,
        campaign_id=req.campaign_id,
        photo_hash=req.photo_hash,
        description_hash=req.description_hash,
        status=0,
        resolved=False,
        lat=req.lat,
        long=req.long
    )
    session.add(submission_model)
    campaign = session.query(models.StashCampaign).filter(models.StashCampaign.campaign_id==req.campaign_id).first()
    if campaign:
        campaign.remained_submissions = campaign.remained_submissions - 1
    session.commit()
    hash = session.query(models.Description).get(req.description_hash)
    return submission.Submission(
        id=submission_model.id,
        submission_id=submission_model.submission_id,
        campaign_id=submission_model.campaign_id,
        description=hash.content,
        photo_url=f"/api/photos/{submission_model.photo_hash}",
        status=submission_model.status,
        lat=submission_model.lat,
        long=submission_model.long,
        resolved=submission_model.resolved,
        state=submission.SubmissionState.DISPUTED
    )


@router.get('/submissions/{submission_id}/accept')
def accept_submission(submission_id: str, session=Depends(get_db)):
    submission = session.query(models.Submission).filter(models.Submission.submission_id==submission_id).first()
    if submission:
        submission.status = 1
        session.commit()
    return {"success": True}


@router.get('/submissions/{submission_id}/reject')
def accept_submission(submission_id: str, session=Depends(get_db)):
    submission = session.query(models.Submission).filter(models.Submission.submission_id==submission_id).first()
    if submission:
        submission.status = 2
        session.commit()
    return {"success": True}


@router.get('/submissions/{submission_id}/dispute')
def accept_submission(submission_id: str, description_hash: str, disputer: str,
                      session=Depends(get_db)):
    submission = session.query(models.Submission).filter(models.Submission.submission_id==submission_id).first()
    if submission:
        dispute = models.Dispute(
            submission_id=submission_id,
            author_address=disputer,
            description_hash=description_hash
        )
        session.add(dispute)
        submission.status = 0
        session.commit()
    return {"success": True}
