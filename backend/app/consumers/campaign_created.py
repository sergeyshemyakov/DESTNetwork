import json
from app.consumers.base_consumer import BaseConsumer
from app.consumers.campaign_consumer import CampaignEventConsumer
from app.models import StashCampaign
import time
import threading


class CampaignCreatedEventConsumer(BaseConsumer):

    CAMPAIGN_MANAGER_ABI = json.loads("""[{"inputs":[{"internalType":"contract ProofOfHumanity","name":"_proofOfHumanity","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"campaign","type":"address"}],"name":"CampaignCreated","type":"event"},{"inputs":[],"name":"CAMPAIGN_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DISPUT_DEPOSIT_AMOUNT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"campaigns","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"category","type":"uint256"},{"internalType":"uint256","name":"maxSubmissions","type":"uint256"},{"internalType":"uint256","name":"reward","type":"uint256"},{"internalType":"contract IERC20","name":"rewardToken","type":"address"},{"components":[{"internalType":"int256","name":"lat","type":"int256"},{"internalType":"int256","name":"long","type":"int256"}],"internalType":"struct StashCampaign.Coordinate","name":"topLeft","type":"tuple"},{"components":[{"internalType":"int256","name":"lat","type":"int256"},{"internalType":"int256","name":"long","type":"int256"}],"internalType":"struct StashCampaign.Coordinate","name":"bottomRight","type":"tuple"},{"internalType":"bytes32","name":"descriptionHash","type":"bytes32"},{"internalType":"address","name":"dummy1","type":"address"},{"internalType":"address","name":"dummy2","type":"address"},{"internalType":"address","name":"dummy3","type":"address"}],"name":"createCampaign","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"deployer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proofOfHumanity","outputs":[{"internalType":"contract ProofOfHumanity","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"campaign","type":"address"}],"name":"registerCampaign","outputs":[],"stateMutability":"nonpayable","type":"function"}]""")
    
    CAMPAIGN_ABI = json.loads("""[{"inputs":[{"internalType":"uint256","name":"_campaignExpirationTimestamp","type":"uint256"},{"internalType":"address","name":"_campaignCreator","type":"address"},{"internalType":"uint256","name":"_category","type":"uint256"},{"internalType":"uint256","name":"_maxSubmissions","type":"uint256"},{"internalType":"uint256","name":"_reward","type":"uint256"},{"internalType":"contract IERC20","name":"_rewardToken","type":"address"},{"components":[{"internalType":"int256","name":"lat","type":"int256"},{"internalType":"int256","name":"long","type":"int256"}],"internalType":"struct StashCampaign.Coordinate","name":"topLeft","type":"tuple"},{"components":[{"internalType":"int256","name":"lat","type":"int256"},{"internalType":"int256","name":"long","type":"int256"}],"internalType":"struct StashCampaign.Coordinate","name":"bottomRight","type":"tuple"},{"internalType":"bytes32","name":"_descriptionHash","type":"bytes32"},{"internalType":"contract ProofOfHumanity","name":"_proofOfHumanity","type":"address"},{"internalType":"contract CampaignManager","name":"_campaignManager","type":"address"},{"internalType":"uint256","name":"_disputDepositAmount","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"submissionID","type":"address"},{"indexed":true,"internalType":"address","name":"Disputor","type":"address"}],"name":"Disputed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"submissionID","type":"address"}],"name":"Resolved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"submitter","type":"address"}],"name":"SubmissionCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"submissionID","type":"address"},{"indexed":false,"internalType":"enum StashCampaign.SubmissionStatus","name":"status","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"minResolveTimestamp","type":"uint256"}],"name":"SubmissionFinalized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"submissionID","type":"address"},{"indexed":true,"internalType":"address","name":"verifier","type":"address"}],"name":"VoteRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"submissionID","type":"address"},{"indexed":true,"internalType":"address","name":"verifier","type":"address"}],"name":"Voted","type":"event"},{"inputs":[],"name":"DISPUTE_WINDOW","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_SUBMISSION_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"VERIFICATION_ROUND_SIZE","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"campaignArea","outputs":[{"internalType":"int256","name":"lat","type":"int256"},{"internalType":"int256","name":"long","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"campaignCreator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"campaignExpirationTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"campaignManager","outputs":[{"internalType":"contract CampaignManager","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"category","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"dummySubmitter","type":"address"}],"name":"createDummySubmission","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_photoHash","type":"bytes32"},{"internalType":"bytes32","name":"_descriptionHash","type":"bytes32"},{"internalType":"int256","name":"_lat","type":"int256"},{"internalType":"int256","name":"_long","type":"int256"}],"name":"createSubmission","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"descriptionHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"disputDepositAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"submissionId","type":"address"},{"internalType":"bytes32","name":"disputorNotesHash","type":"bytes32"}],"name":"dispute","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"maxSubmissions","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proofOfHumanity","outputs":[{"internalType":"contract ProofOfHumanity","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"recoupCampaignTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"submissionId","type":"address"}],"name":"resolve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewardToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"submissionIds","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"submissions","outputs":[{"internalType":"bytes32","name":"photoHash","type":"bytes32"},{"internalType":"bytes32","name":"descriptionHash","type":"bytes32"},{"internalType":"uint256","name":"minResolveTimestamp","type":"uint256"},{"internalType":"uint256","name":"lockedReward","type":"uint256"},{"components":[{"internalType":"int256","name":"lat","type":"int256"},{"internalType":"int256","name":"long","type":"int256"}],"internalType":"struct StashCampaign.Coordinate","name":"location","type":"tuple"},{"internalType":"enum StashCampaign.SubmissionStatus","name":"status","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"submissionId","type":"address"},{"internalType":"enum StashCampaign.VoteOpinion","name":"opinion","type":"uint8"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"}]""")

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.consumer_name = "CampaignCreatedConsumer"
        self.spawned_consumers = []
        contract = self.w3.eth.contract(address=self.contract_address, abi=self.CAMPAIGN_MANAGER_ABI)
        self.event_filter = contract.events.CampaignCreated.create_filter(fromBlock="latest")
        self.children = []
        self.child_threads = []
        existing_campaigns = [
            item.campaign_id for item in self.session.query(StashCampaign).filter(StashCampaign.blockchain==self.blockchain_name).all()
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
            reward=str(campaign_contract.functions.reward().call()),
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
        print(f"Starting child consumer for {campaign_address}")
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
            while not self.stopped and not any(x.stopped for x in self.children):
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
    