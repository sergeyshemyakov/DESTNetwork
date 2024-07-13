from sqlalchemy import Column, String, LargeBinary

from .base import Base

class Photo(Base):
    __tablename__ = "photos"

    hash = Column(String, primary_key=True, index=True)
    image = Column(LargeBinary)
