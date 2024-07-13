from sqlalchemy import Column, Float, Integer, String

from .base import Base

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(String)
    campaign_id = Column(String)
    photo_hash = Column(String)
    description_hash = Column(String)
    status = Column(Integer)
    lat = Column(Float)
    long = Column(Float)
