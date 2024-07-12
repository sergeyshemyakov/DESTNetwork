from sqlalchemy import Column, String

from .base import Base

class Description(Base):
    __tablename__ = "descriptions"

    hash = Column(String, primary_key=True, index=True)
    content = Column(String)
