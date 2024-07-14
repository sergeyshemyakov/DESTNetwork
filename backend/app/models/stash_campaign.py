from sqlalchemy import BigInteger, Column, Float, Integer, String

from .base import Base

class StashCampaign(Base):
    __tablename__ = "stash_campaigns"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(String)
    description_hash = Column(String)
    campaign_creator = Column(String)
    reward = Column(String)
    reward_token = Column(String)
    blockchain = Column(String)
    token_symbol = Column(String)
    campaign_type = Column(Integer)
    max_submissions = Column(Integer)
    remained_submissions = Column(Integer)
    top_left_lat = Column(Float)
    top_left_long = Column(Float)
    bottom_right_lat = Column(Float)
    bottom_right_long = Column(Float)
    expiration_timestamp = Column(Integer)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
