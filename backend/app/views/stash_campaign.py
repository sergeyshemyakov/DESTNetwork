import hashlib

from typing import List
from fastapi import APIRouter, Depends

from app import models
from app.dependencies import get_db
from app.schemas import stash_campaign

router = APIRouter()


@router.get("/stash-campaigns/{campaign_id}", response_model=stash_campaign.StashCampaign)
def get_campaign(description_hash: str, session=Depends(get_db)):
    return {
        "campaign_id": "cmp123",
        "description": "A campaign to promote environmental awareness.",
        "campaign_type": 1,
        "campaign_creator": "creator001",
        "reward": 500,
        "reward_token": "rewardToken123",
        "token_symbol": "ETH",
        "blockchain": "ethereum",
        "max_submissions": 1000,
        "remained_submissions": 800,
        "top_left": {
            "lat": 40.712776,
            "long": -74.005974
        },
        "bottom_right": {
            "lat": 34.052235,
            "long": -118.243683
        }
    }


@router.get("/stash-campaigns/", response_model=List[stash_campaign.StashCampaign])
def list_campaigns(session=Depends(get_db)):
    return [
        {
            "campaign_id": "cmp123",
            "description": "A campaign to promote environmental awareness.",
            "campaign_type": 1,
            "campaign_creator": "creator001",
            "reward": 500,
            "reward_token": "rewardToken123",
            "token_symbol": "ETH",
            "blockchain": "ethereum",
            "max_submissions": 1000,
            "remained_submissions": 800,
            "top_left": {
            "lat": 40.712776,
            "long": -74.005974
            },
            "bottom_right": {
            "lat": 34.052235,
            "long": -118.243683
            }
        },
        {
            "campaign_id": "cmp456",
            "description": "A campaign to support local businesses.",
            "campaign_type": 2,
            "campaign_creator": "creator002",
            "reward": 1000,
            "reward_token": "rewardToken456",
            "token_symbol": "BTC",
            "blockchain": "bitcoin",
            "max_submissions": 500,
            "remained_submissions": 450,
            "top_left": {
                "lat": 51.507351,
                "long": -0.127758
            },
            "bottom_right": {
                "lat": 48.856613,
                "long": 2.352222
            }
        }
    ]
