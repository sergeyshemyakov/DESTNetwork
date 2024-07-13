from pydantic import BaseModel, computed_field
from enum import Enum

class SubmissionState(Enum):
    TO_VERIFY = "To verify"
    DISPUTED = "Disputed"
    FINALIZED = "Finalized"
    RESOLVED = "Resolved"


class Submission(BaseModel):
    id: int
    submission_id: str
    campaign_id: str
    photo_url: str
    description: str
    status: int
    resolved: bool
    lat: float
    long: float
    state: SubmissionState
    
    @staticmethod
    def calc_state(to_verify: bool, status: int, resolved: bool) -> str:
        if to_verify and status == 0:
            return SubmissionState.TO_VERIFY
        if not to_verify and status == 0:
            return SubmissionState.DISPUTED
        if resolved:
            return SubmissionState.RESOLVED
        return SubmissionState.FINALIZED
