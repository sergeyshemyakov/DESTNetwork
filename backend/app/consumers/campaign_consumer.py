import json
import time

from app.consumers.base_consumer import BaseConsumer
from app.models import StashCampaign, Submission, VerificationRequest, Dispute


class CampaignEventConsumer(BaseConsumer):

    DUMMY_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000"

    CAMPAIGN_ABI = json.loads("""[{"inputs":[{"internalType":"uint256","name":"_campaignExpirationTimestamp","type":"uint256"},{"internalType":"address","name":"_campaignCreator","type":"address"},{"internalType":"uint256","name":"_category","type":"uint256"},{"internalType":"uint256","name":"_maxSubmissions","type":"uint256"},{"internalType":"uint256","name":"_reward","type":"uint256"},{"internalType":"contract IERC20","name":"_rewardToken","type":"address"},{"components":[{"internalType":"int256","name":"lat","type":"int256"},{"internalType":"int256","name":"long","type":"int256"}],"internalType":"struct StashCampaign.Coordinate","name":"topLeft","type":"tuple"},{"components":[{"internalType":"int256","name":"lat","type":"int256"},{"internalType":"int256","name":"long","type":"int256"}],"internalType":"struct StashCampaign.Coordinate","name":"bottomRight","type":"tuple"},{"internalType":"bytes32","name":"_descriptionHash","type":"bytes32"},{"internalType":"contract ProofOfHumanity","name":"_proofOfHumanity","type":"address"},{"internalType":"contract CampaignManager","name":"_campaignManager","type":"address"},{"internalType":"uint256","name":"_disputDepositAmount","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"submissionID","type":"address"},{"indexed":true,"internalType":"address","name":"Disputor","type":"address"}],"name":"Disputed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"submissionID","type":"address"}],"name":"Resolved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"submitter","type":"address"}],"name":"SubmissionCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"submissionID","type":"address"},{"indexed":false,"internalType":"enum StashCampaign.SubmissionStatus","name":"status","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"minResolveTimestamp","type":"uint256"}],"name":"SubmissionFinalized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"submissionID","type":"address"},{"indexed":true,"internalType":"address","name":"verifier","type":"address"}],"name":"VoteRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"submissionID","type":"address"},{"indexed":true,"internalType":"address","name":"verifier","type":"address"}],"name":"Voted","type":"event"},{"inputs":[],"name":"DISPUTE_WINDOW","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_SUBMISSION_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"VERIFICATION_ROUND_SIZE","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"campaignArea","outputs":[{"internalType":"int256","name":"lat","type":"int256"},{"internalType":"int256","name":"long","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"campaignCreator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"campaignExpirationTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"campaignManager","outputs":[{"internalType":"contract CampaignManager","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"category","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"dummySubmitter","type":"address"}],"name":"createDummySubmission","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_photoHash","type":"bytes32"},{"internalType":"bytes32","name":"_descriptionHash","type":"bytes32"},{"internalType":"int256","name":"_lat","type":"int256"},{"internalType":"int256","name":"_long","type":"int256"}],"name":"createSubmission","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"descriptionHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"disputDepositAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"submissionId","type":"address"},{"internalType":"bytes32","name":"disputorNotesHash","type":"bytes32"}],"name":"dispute","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"maxSubmissions","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proofOfHumanity","outputs":[{"internalType":"contract ProofOfHumanity","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"recoupCampaignTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"submissionId","type":"address"}],"name":"resolve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewardToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"submissionIds","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"submissions","outputs":[{"internalType":"bytes32","name":"photoHash","type":"bytes32"},{"internalType":"bytes32","name":"descriptionHash","type":"bytes32"},{"internalType":"uint256","name":"minResolveTimestamp","type":"uint256"},{"internalType":"uint256","name":"lockedReward","type":"uint256"},{"components":[{"internalType":"int256","name":"lat","type":"int256"},{"internalType":"int256","name":"long","type":"int256"}],"internalType":"struct StashCampaign.Coordinate","name":"location","type":"tuple"},{"internalType":"enum StashCampaign.SubmissionStatus","name":"status","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"submissionId","type":"address"},{"internalType":"enum StashCampaign.VoteOpinion","name":"opinion","type":"uint8"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"}]""")

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.consumer_name = "CampaignEventConsumer"
        contract = self.w3.eth.contract(address=self.contract_address, abi=self.CAMPAIGN_ABI)
        self.submission_created_event_filter = contract.events.SubmissionCreated.create_filter(fromBlock="latest")
        self.submission_disputed_event_filter = contract.events.Disputed.create_filter(fromBlock="latest")
        self.submission_finalized_event_filter = contract.events.SubmissionFinalized.create_filter(fromBlock="latest")
        self.submission_resolved_event_filter = contract.events.Resolved.create_filter(fromBlock="latest")
        self.submission_vote_requested_event_filter = contract.events.VoteRequested.create_filter(fromBlock="latest")
        self.submission_voted_event_filter = contract.events.Voted.create_filter(fromBlock="latest")

    def consume(self):
        print(f"Started consumer for {self.consumer_name}, blockchain: {self.blockchain_name}, contract address: {self.contract_address}")
        try:
            while not self.stopped:
                for event in self.submission_created_event_filter.get_new_entries():
                    self.log_event(event)
                    self.handle_submission_creation(event)
                time.sleep(1)
                for event in self.submission_disputed_event_filter.get_new_entries():
                    self.log_event(event)
                    self.handle_submission_dispution(event)
                time.sleep(1)
                for event in self.submission_finalized_event_filter.get_new_entries():
                    self.log_event(event)
                    self.handle_submission_finalization(event)
                time.sleep(1)
                for event in self.submission_resolved_event_filter.get_new_entries():
                    self.log_event(event)
                    self.handle_submission_resolving(event)
                time.sleep(1)
                for event in self.submission_vote_requested_event_filter.get_new_entries():
                    self.log_event(event)
                    self.handle_vote_request(event)
                for event in self.submission_voted_event_filter.get_new_entries():
                    self.log_event(event)
                    self.handle_voted(event)
                time.sleep(1)
                time.sleep(self.poll_interval)
        finally:
            print("virubaem mikrochela")
            self.session.close()
            self.stopped = True

    def handle_submission_creation(self, event):

        submission_id = event['args']['submissionID']
        campaign_contract = self.w3.eth.contract(self.contract_address, abi=self.CAMPAIGN_ABI)
        submission = campaign_contract.functions.submissions(submission_id).call()
        if submission['minResolveTimestamp'] == 0:
            print("dummy submission, skip")
            return
        campaign_id = self.contract_address
        submission_model = Submission(
            submission_id=submission_id,
            campaign_id=campaign_id,
            photo_hash=submission['photoHash'].hex(),
            description_hash=submission['descriptionHash'].hex(),
            status=submission['status'],
            resolved=False,
            lat=submission['location'][0]/1000000,
            long=submission['location'][1]/1000000
        )
        print(submission_model.to_dict())
        campaign = self.session.query(StashCampaign).filter(StashCampaign.campaign_id==campaign_id).first()
        campaign.remained_submissions = campaign.remained_submissions - 1
        self.session.add(submission_model)
        self.session.commit()

    def handle_submission_dispution(self, event):
        submission_id = event['args']['submissionID']
        sender_address = event['args']['disputor']
        dispute = Dispute(
            submission_id = submission_id,
            sender_address = sender_address
        )
        self.session.add(dispute)
        self.session.commit()

    def handle_submission_finalization(self, event):
        submission_id = event['args']['submissionID']
        submission_status = event['args']['status']
        submission = self.session.query(Submission).filter(Submission.submission_id==submission_id).first()
        if submission:
            submission.status = submission_status
            self.session.commit()

    def handle_submission_resolving(self, event):
        submission_id = event['args']['submissionID']
        submission = self.session.query(Submission).filter(Submission.submission_id==submission_id).first()
        if submission:
            submission.resolved = True
            self.session.commit()

    def handle_vote_request(self, event):
        submission_id = event['args']['submissionID']
        verifier_address = event['args']['verifier']
        verification_request = VerificationRequest(
            submission_id=submission_id,
            verifier_id=verifier_address
        )
        self.session.add(verification_request)
        self.session.commit()

    def handle_voted(self, event):
        submission_id = event['args']['submissionID']
        verifier_address = event['args']['verifier']
        verification_request = self.session.query(VerificationRequest)\
            .filter(
                VerificationRequest.submission_id==submission_id,
                VerificationRequest.verifier_id==verifier_address).first()
        if verification_request:
            verification_request.voted = True
            self.session.commit()

    def log_event(self, event):
        print(f"Event for consumer: {self.consumer_name}, blockchain: {self.blockchain_name},"
                f" contract address: {self.contract_address}, event: {event}")
