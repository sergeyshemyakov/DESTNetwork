from sqlalchemy import Column, Float, Integer, String

from .base import Base

class VerificationRequest(Base):
    __tablename__ = "verification_requests"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(String)
    verifier_id = Column(String)
    status = Column(String)
