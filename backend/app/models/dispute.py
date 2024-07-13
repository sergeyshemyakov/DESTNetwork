from sqlalchemy import Column, String, Integer

from .base import Base

class Dispute(Base):
    __tablename__ = "disputes"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(String)
    author_address = Column(String)
