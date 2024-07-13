from pydantic import BaseModel


class VerificationRequest(BaseModel):
    id: int
    submission_id: str
    verifier_id: str
    status: str

    class Config:
        orm_mode = True
