import hashlib

from typing import List
from fastapi import APIRouter, Depends

from app import models
from app.dependencies import get_db
from app.schemas import stash_campaign

router = APIRouter()


@router.get("/stash-campaigns/{campaign_id}", response_model=stash_campaign.StashCampaign)
def get_campaign(campaign_id: str, session=Depends(get_db)):
    item: models.StashCampaign = session.query(models.StashCampaign)\
        .filter(campaign_id=campaign_id).first()
    description: models.Description = session.query(models.Description).get(item.description_hash)
    return stash_campaign.StashCampaign(
        campaign_id=item.campaign_id,
        description=description.content,
        campaign_type=item.campaign_type,
        campaign_creator=item.campaign_creator,
        reward=item.reward,
        reward_token=item.reward_token,
        token_symbol=item.token_symbol,
        blockchain=item.blockchain,
        max_submissions=item.max_submissions,
        remained_submissions=item.remained_submissions,
        top_left=stash_campaign.Point(item.top_left_lat, item.top_left_long),
        bottom_right=stash_campaign.Point(item.bottom_right_lat, item.bottom_right_long)
    )


@router.get("/stash-campaigns/", response_model=List[stash_campaign.StashCampaign])
def list_campaigns(blockchain: str | None = None, session=Depends(get_db)):
    q = session.query(models.StashCampaign, models.Description).join(models.Description, models.StashCampaign.description_hash==models.Description.hash)
    if blockchain:
        q = q.filter(models.StashCampaign.blockchain==blockchain)    
    return [
        stash_campaign.StashCampaign(
            campaign_id=row.StashCampaign.campaign_id,
            description=row.Description.content,
            campaign_type=row.StashCampaign.campaign_type,
            campaign_creator=row.StashCampaign.campaign_creator,
            reward=row.StashCampaign.reward,
            reward_token=row.StashCampaign.reward_token,
            token_symbol=row.StashCampaign.token_symbol,
            blockchain=row.StashCampaign.blockchain,
            max_submissions=row.StashCampaign.max_submissions,
            remained_submissions=row.StashCampaign.remained_submissions,
            top_left=stash_campaign.Point(row.StashCampaign.top_left_lat, row.StashCampaign.top_left_long),
            bottom_right=stash_campaign.Point(row.StashCampaign.bottom_right_lat, row.StashCampaign.bottom_right_long)
        )
        for row in q.all()
    ]


@router.get("/blockchains", response_model=List[str])
def list_blockchains():
    return []

