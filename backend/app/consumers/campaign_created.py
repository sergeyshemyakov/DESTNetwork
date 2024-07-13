import json
from app.consumers.base_consumer import BaseConsumer
from app.consumers.campaign_consumer import CampaignEventConsumer
from app.models import StashCampaign
import time
import threading


class CampaignCreatedEventConsumer(BaseConsumer):

    CAMPAIGN_MANAGER_ABI = json.loads("""[{
    "anonymous": false,
    "inputs": [
        {
            "indexed": true,
            "internalType": "address",
            "name": "campaign",
            "type": "address"
        }
    ],
    "name": "CampaignCreated",
    "type": "event"
}]
""")
    
    CAMPAIGN_ABI = json.loads("""
                              [{"type":"constructor","inputs":[{"name":"_campaignExpirationTimestamp","type":"uint256","internalType":"uint256"},{"name":"_campaignCreator","type":"address","internalType":"address"},{"name":"_category","type":"uint256","internalType":"uint256"},{"name":"_maxSubmissions","type":"uint256","internalType":"uint256"},{"name":"_reward","type":"uint256","internalType":"uint256"},{"name":"_rewardToken","type":"address","internalType":"contract IERC20"},{"name":"topLeft","type":"tuple","internalType":"struct StashCampaign.Coordinate","components":[{"name":"lat","type":"int256","internalType":"int256"},{"name":"long","type":"int256","internalType":"int256"}]},{"name":"bottomRight","type":"tuple","internalType":"struct StashCampaign.Coordinate","components":[{"name":"lat","type":"int256","internalType":"int256"},{"name":"long","type":"int256","internalType":"int256"}]},{"name":"_descriptionHash","type":"bytes32","internalType":"bytes32"},{"name":"_proofOfHumanity","type":"address","internalType":"contract ProofOfHumanity"},{"name":"_campaignManager","type":"address","internalType":"contract CampaignManager"},{"name":"_disputDepositAmount","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"DISPUTE_WINDOW","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"MIN_SUBMISSION_DURATION","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"VERIFICATION_ROUND_SIZE","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"campaignArea","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"lat","type":"int256","internalType":"int256"},{"name":"long","type":"int256","internalType":"int256"}],"stateMutability":"view"},{"type":"function","name":"campaignCreator","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"campaignExpirationTimestamp","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"campaignManager","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract CampaignManager"}],"stateMutability":"view"},{"type":"function","name":"category","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"createDummySubmission","inputs":[{"name":"dummySubmitter","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"createSubmission","inputs":[{"name":"_photoHash","type":"bytes32","internalType":"bytes32"},{"name":"_descriptionHash","type":"bytes32","internalType":"bytes32"},{"name":"_location","type":"tuple","internalType":"struct StashCampaign.Coordinate","components":[{"name":"lat","type":"int256","internalType":"int256"},{"name":"long","type":"int256","internalType":"int256"}]}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"descriptionHash","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"disputDepositAmount","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"dispute","inputs":[{"name":"submissionId","type":"address","internalType":"address"},{"name":"disputorNotesHash","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"maxSubmissions","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"proofOfHumanity","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract ProofOfHumanity"}],"stateMutability":"view"},{"type":"function","name":"recoupCampaignTokens","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"resolve","inputs":[{"name":"submissionId","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"reward","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"rewardToken","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract IERC20"}],"stateMutability":"view"},{"type":"function","name":"submissionIds","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"submissions","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"photoHash","type":"bytes32","internalType":"bytes32"},{"name":"descriptionHash","type":"bytes32","internalType":"bytes32"},{"name":"minResolveTimestamp","type":"uint256","internalType":"uint256"},{"name":"lockedReward","type":"uint256","internalType":"uint256"},{"name":"location","type":"tuple","internalType":"struct StashCampaign.Coordinate","components":[{"name":"lat","type":"int256","internalType":"int256"},{"name":"long","type":"int256","internalType":"int256"}]},{"name":"status","type":"uint8","internalType":"enum StashCampaign.SubmissionStatus"}],"stateMutability":"view"},{"type":"function","name":"vote","inputs":[{"name":"submissionId","type":"address","internalType":"address"},{"name":"opinion","type":"uint8","internalType":"enum StashCampaign.VoteOpinion"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"event","name":"Disputed","inputs":[{"name":"submissionID","type":"address","indexed":true,"internalType":"address"},{"name":"Disputor","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"Resolved","inputs":[{"name":"submissionID","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"SubmissionCreated","inputs":[{"name":"submitter","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"SubmissionFinalized","inputs":[{"name":"submissionID","type":"address","indexed":true,"internalType":"address"},{"name":"status","type":"uint8","indexed":false,"internalType":"enum StashCampaign.SubmissionStatus"},{"name":"minResolveTimestamp","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"VoteRequested","inputs":[{"name":"submissionID","type":"address","indexed":true,"internalType":"address"},{"name":"verifier","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"Voted","inputs":[{"name":"submissionID","type":"address","indexed":true,"internalType":"address"},{"name":"verifier","type":"address","indexed":true,"internalType":"address"}],"anonymous":false}]
                              """)

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.consumer_name = "CampaignCreatedConsumer"
        self.spawned_consumers = []
        contract = self.w3.eth.contract(address=self.contract_address, abi=self.CAMPAIGN_MANAGER_ABI)
        self.event_filter = contract.events.CampaignCreated.create_filter(fromBlock="latest")
        self.children = []
        self.child_threads = []
        existing_campaigns = [
            item.campaign_id for item in self.session.query(StashCampaign).all()
        ]
        for campaign_id in existing_campaigns:
            try:
                self.spawn_consumer(campaign_id)
            except Exception as e:
                print(e, f"cannot spawn consumer for {campaign_id}")
        

    def handle_event(self, event):
        campaign_address = event.get("args").get("campaign")
        self.save_stash_campaign(campaign_address)
        self.spawn_consumer(campaign_address)

    def save_stash_campaign(self, campaign_address):
        campaign_contract = self.w3.eth.contract(campaign_address, abi=self.CAMPAIGN_ABI)

        top_left_lat, top_left_long = campaign_contract.functions.campaignArea(0).call()
        bottom_right_lat, bottom_right_long = campaign_contract.functions.campaignArea(1).call()
        max_submissions = campaign_contract.functions.maxSubmissions().call()
        reward_token = campaign_contract.functions.rewardToken().call()
        expiration_timestamp = campaign_contract.functions.campaignExpirationTimestamp().call()
    
        stash_campaign = StashCampaign(
            campaign_id=campaign_address,
            description_hash=campaign_contract.functions.descriptionHash().call().hex(),
            campaign_creator=campaign_contract.functions.campaignCreator().call(),
            reward=campaign_contract.functions.reward().call(),
            reward_token=reward_token,
            blockchain=self.blockchain_name,
            campaign_type=campaign_contract.functions.category().call(),
            max_submissions=max_submissions,
            remained_submissions=max_submissions,
            top_left_lat=top_left_lat/1000000,
            top_left_long=top_left_long/1000000,
            bottom_right_lat=bottom_right_lat/1000000,
            bottom_right_long=bottom_right_long/1000000,
            token_symbol="DSTNT",
            expiration_timestamp=expiration_timestamp
        )
        print(stash_campaign.to_dict())
        self.session.add(stash_campaign)
        self.session.commit()

    def spawn_consumer(self, campaign_address):
        new_consumer = CampaignEventConsumer(
            self.provider,
            campaign_address,
            self.blockchain_name
        )
        t1 = threading.Thread(target=new_consumer.consume)
        t1.setDaemon(True)
        self.children.append(new_consumer)
        self.child_threads.append(t1)
        t1.start()

    def consume(self):
        print(f"Started consumer for {self.consumer_name}, blockchain: {self.blockchain_name}, contract address: {self.contract_address}")
        try:
            while not self.stopped:
                for event in self.event_filter.get_new_entries():
                    print(f"Event for consumer: {self.consumer_name}, blockchain: {self.blockchain_name},"
                        f" contract address: {self.contract_address}, event: {event}")
                    self.handle_event(event)
                time.sleep(self.poll_interval)
        finally:
            print("virubaem bazu")
            self.session.close()
            self.stopped = True
            for consumer in self.children:
                consumer.stopped = True
            for thread in self.child_threads:
                thread.join()
    