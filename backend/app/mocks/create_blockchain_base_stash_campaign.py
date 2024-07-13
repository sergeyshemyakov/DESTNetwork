import sys

from app.models import StashCampaign
from app.db import SessionLocal

session = SessionLocal()


def create_stash_campaign(campaign_address, reward_token, blockchain_name):
    stash_campaign = StashCampaign(
        campaign_id=campaign_address,
        description_hash="fd87ed11e357c1105af46476db6207eed8d3d9716705bfd2e702554c0b65e3f1",
        campaign_creator="0xabadc4402C14844431fC7521613b6922c7bdde80",
        reward=10*(10**18),
        reward_token=reward_token,
        blockchain=blockchain_name,
        campaign_type=0,
        max_submissions=100,
        remained_submissions=100,
        top_left_lat=50.860940,
        top_left_long=4.307974,
        bottom_right_lat=50.829232,
        bottom_right_long=4.358909,
        token_symbol="DSTNT",
        expiration_timestamp=1723582174
    )
    session.add(stash_campaign)
    session.commit()

if __name__ == "__main__":
    double_args = create_stash_campaign(sys.argv[1], sys.argv[2], sys.argv[3])
    print("In mymodule:",double_args)
    session.close()