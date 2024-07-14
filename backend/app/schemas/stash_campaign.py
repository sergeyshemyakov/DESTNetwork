from pydantic import BaseModel

class Point(BaseModel):
    lat: float
    long: float

class StashCampaign(BaseModel):
    campaign_id: str
    description: str
    campaign_type: int
    campaign_creator: str
    reward: str
    reward_token: str
    token_symbol: str
    blockchain: str
    max_submissions: int
    remained_submissions: int
    top_left: Point
    bottom_right: Point
