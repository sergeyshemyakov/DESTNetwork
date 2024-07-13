from pydantic import BaseModel


class Submission(BaseModel):
    id: int
    submission_id: str
    campaign_id: str
    photo_url: str
    description: str
    status: int
    lat: float
    long: float
