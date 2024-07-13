import json
import time

from app.consumers.base_consumer import BaseConsumer
from app.models import StashCampaign, Submission, VerificationRequest, Dispute


class CampaignEventConsumer(BaseConsumer):

    DUMMY_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000"

    CAMPAIGN_ABI = json.loads("""
                              [{"type":"constructor","inputs":[{"name":"_campaignExpirationTimestamp","type":"uint256","internalType":"uint256"},{"name":"_campaignCreator","type":"address","internalType":"address"},{"name":"_category","type":"uint256","internalType":"uint256"},{"name":"_maxSubmissions","type":"uint256","internalType":"uint256"},{"name":"_reward","type":"uint256","internalType":"uint256"},{"name":"_rewardToken","type":"address","internalType":"contract IERC20"},{"name":"topLeft","type":"tuple","internalType":"struct StashCampaign.Coordinate","components":[{"name":"lat","type":"int256","internalType":"int256"},{"name":"long","type":"int256","internalType":"int256"}]},{"name":"bottomRight","type":"tuple","internalType":"struct StashCampaign.Coordinate","components":[{"name":"lat","type":"int256","internalType":"int256"},{"name":"long","type":"int256","internalType":"int256"}]},{"name":"_descriptionHash","type":"bytes32","internalType":"bytes32"},{"name":"_proofOfHumanity","type":"address","internalType":"contract ProofOfHumanity"},{"name":"_campaignManager","type":"address","internalType":"contract CampaignManager"},{"name":"_disputDepositAmount","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"DISPUTE_WINDOW","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"MIN_SUBMISSION_DURATION","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"VERIFICATION_ROUND_SIZE","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"campaignArea","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"lat","type":"int256","internalType":"int256"},{"name":"long","type":"int256","internalType":"int256"}],"stateMutability":"view"},{"type":"function","name":"campaignCreator","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"campaignExpirationTimestamp","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"campaignManager","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract CampaignManager"}],"stateMutability":"view"},{"type":"function","name":"category","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"createDummySubmission","inputs":[{"name":"dummySubmitter","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"createSubmission","inputs":[{"name":"_photoHash","type":"bytes32","internalType":"bytes32"},{"name":"_descriptionHash","type":"bytes32","internalType":"bytes32"},{"name":"_location","type":"tuple","internalType":"struct StashCampaign.Coordinate","components":[{"name":"lat","type":"int256","internalType":"int256"},{"name":"long","type":"int256","internalType":"int256"}]}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"descriptionHash","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"disputDepositAmount","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"dispute","inputs":[{"name":"submissionId","type":"address","internalType":"address"},{"name":"disputorNotesHash","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"maxSubmissions","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"proofOfHumanity","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract ProofOfHumanity"}],"stateMutability":"view"},{"type":"function","name":"recoupCampaignTokens","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"resolve","inputs":[{"name":"submissionId","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"reward","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"rewardToken","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract IERC20"}],"stateMutability":"view"},{"type":"function","name":"submissionIds","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"submissions","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"photoHash","type":"bytes32","internalType":"bytes32"},{"name":"descriptionHash","type":"bytes32","internalType":"bytes32"},{"name":"minResolveTimestamp","type":"uint256","internalType":"uint256"},{"name":"lockedReward","type":"uint256","internalType":"uint256"},{"name":"location","type":"tuple","internalType":"struct StashCampaign.Coordinate","components":[{"name":"lat","type":"int256","internalType":"int256"},{"name":"long","type":"int256","internalType":"int256"}]},{"name":"status","type":"uint8","internalType":"enum StashCampaign.SubmissionStatus"}],"stateMutability":"view"},{"type":"function","name":"vote","inputs":[{"name":"submissionId","type":"address","internalType":"address"},{"name":"opinion","type":"uint8","internalType":"enum StashCampaign.VoteOpinion"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"event","name":"Disputed","inputs":[{"name":"submissionID","type":"address","indexed":true,"internalType":"address"},{"name":"Disputor","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"Resolved","inputs":[{"name":"submissionID","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"SubmissionCreated","inputs":[{"name":"submitter","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"SubmissionFinalized","inputs":[{"name":"submissionID","type":"address","indexed":true,"internalType":"address"},{"name":"status","type":"uint8","indexed":false,"internalType":"enum StashCampaign.SubmissionStatus"},{"name":"minResolveTimestamp","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"VoteRequested","inputs":[{"name":"submissionID","type":"address","indexed":true,"internalType":"address"},{"name":"verifier","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"Voted","inputs":[{"name":"submissionID","type":"address","indexed":true,"internalType":"address"},{"name":"verifier","type":"address","indexed":true,"internalType":"address"}],"anonymous":false}]
                              """)

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
                    self.log_event()
                    self.handle_submission_creation(event)
                time.sleep(1)
                for event in self.submission_disputed_event_filter.get_new_entries():
                    self.log_event()
                    self.handle_submission_dispution(event)
                time.sleep(1)
                for event in self.submission_finalized_event_filter.get_new_entries():
                    self.log_event()
                    self.handle_submission_finalization(event)
                time.sleep(1)
                for event in self.submission_resolved_event_filter.get_new_entries():
                    self.log_event()
                    self.handle_submission_resolving(event)
                time.sleep(1)
                for event in self.submission_vote_requested_event_filter.get_new_entries():
                    self.log_event()
                    self.handle_vote_request(event)
                for event in self.submission_voted_event_filter.get_new_entries():
                    self.log_event()
                    self.handle_voted(event)
                time.sleep(1)
                time.sleep(self.poll_interval)
        finally:
            print("virubaem mikrochela")
            self.session.close()

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
