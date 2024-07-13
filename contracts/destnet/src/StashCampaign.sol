// SPDX-License-Identifier: MIT
pragma solidity >=0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ProofOfHumanity.sol";

contract StashCampaign {
    uint256 immutable MIN_SUBMISSION_DURATION = 120; // should be 7776000 = 3 months for non-hack version
    uint8 immutable VERIFICATION_ROUND_SIZE = 3; // could be bigger for non-hack version
    uint256 immutable DISPUTE_WINDOW = 60; // should be 1209600 = 2 weeks for non-hack version

    enum SubmissionStatus {
        Disputed,
        Accepted,
        Rejected,
        Resolved
    }

    enum VoteOpinion {
        Yes,
        No,
        DisputorYes,
        DisputorNo
    }

    // 6 digits precision, i.e. actual latitude = lat / 10**6
    struct Coordinate {
        uint256 lat;
        uint256 long;
    }

    struct RequestedVote {
        address id;
        bool voted;
    }

    struct Vote {
        address verifier;
        VoteOpinion vote;
    }

    struct Submission {
        bytes32 photoHash;
        bytes32 descriptionHash;
        uint256 minResolveTimestamp;
        uint256 lockedReward;
        Coordinate location;
        SubmissionStatus status;
        RequestedVote[] requestedVotes;
        Vote[] votesOnThis;
        bytes32[] disputorNotesHashes;
    }

    // SubmissionID is the same as the address of the submitter
    event SubmissionCreated(address indexed submitter);

    event VoteRequested(address indexed submissionID, address indexed verifier);

    event Voted(address indexed submissionID, address indexed verifier);

    // Emitted when a unanimous vote on a submission was finalized. Status can be either Accepted or Rejected
    event SubmissionFinalized(address indexed submissionID, SubmissionStatus status, uint256 minResolveTimestamp);

    // Emitted when a dispute is raised against a finalized submission
    event Disputed(address indexed submissionID, address indexed Disputor);

    event Resolved(address indexed submissionID);

    // After this timestamp is reached, campaign creator can reclaim all reward tokens
    uint256 public immutable campaignExpirationTimestamp;
    address public immutable campaignCreator;
    uint256 public immutable category;
    // Maximal possible number of submissions,
    // limited by reward per submission and total reward allocated
    uint256 public immutable maxSubmissions;
    uint256 public immutable reward;
    IERC20 public immutable rewardToken;
    // Amonut of tokens that disputor must deposit to raise a disput
    uint256 public immutable disputDepositAmount;
    // Campaign area is a rectangle given by top left and bottom right vertices
    Coordinate[2] public campaignArea;
    bytes32 public immutable descriptionHash;
    address[] public submissionIds;
    mapping(address => Submission) public submissions;
    ProofOfHumanity public immutable proofOfHumanity;

    constructor(
        uint256 _campaignExpirationTimestamp,
        address _campaignCreator,
        uint256 _category,
        uint256 _maxSubmissions,
        uint256 _reward,
        IERC20 _rewardToken,
        Coordinate memory topLeft,
        Coordinate memory bottomRight,
        bytes32 _descriptionHash,
        ProofOfHumanity _proofOfHumanity,
        uint256 _disputDepositAmount
    ) {
        campaignExpirationTimestamp = _campaignExpirationTimestamp;
        campaignCreator = _campaignCreator;
        category = _category;
        maxSubmissions = _maxSubmissions;
        reward = _reward;
        rewardToken = _rewardToken;
        campaignArea[0] = topLeft;
        campaignArea[1] = bottomRight;
        descriptionHash = _descriptionHash;
        proofOfHumanity = _proofOfHumanity;
        disputDepositAmount = _disputDepositAmount;
    }

    // Samples random verifiers from existing submitters and requires them to vote on submission
    function _requestVerificaiton(address submissionId, uint8 roundLength) internal {
        require(
            roundLength <= submissionIds.length,
            "Not enough existing submissions to assign verifiers, please create some dummy submissions."
        );

        // Sample roundLength random different submissionIDs. We have loops here,
        // should be fine for small roundLength
        address[] memory sampled = new address[](roundLength);
        uint256 i = 1;
        for (uint256 j = 0; j < roundLength; j++) {
            bool reroll = false;
            address randID = submissionIds[uint256(blockhash(block.number - i)) % submissionIds.length];
            i += 1;
            for (uint256 k = 0; k < j; k++) {
                if (sampled[k] == randID) {
                    reroll = true;
                    continue;
                }
            }
            if (!reroll) {
                sampled[j] = randID;
            } else {
                j--;
            }
        }

        // Request votes from all sampled verifiers and emit all events
        for (uint256 j = 0; j < sampled.length; j++) {
            RequestedVote memory requestedVote = RequestedVote(submissionId, false);
            submissions[sampled[j]].requestedVotes.push(requestedVote);
            emit VoteRequested(submissionId, sampled[j]);
        }
    }

    // Creates a submission for the msg.sender. Msg.sender serves as submissionID
    function createSubmission(bytes32 _photoHash, bytes32 _descriptionHash, Coordinate memory _location) public {
        require(
            _location.lat >= campaignArea[1].lat && _location.lat <= campaignArea[0].lat,
            "Location outside of area: latitude"
        );
        require(
            _location.long >= campaignArea[0].long && _location.long <= campaignArea[1].long,
            "Location outside of area: longitude"
        );
        require(submissionIds.length < maxSubmissions, "Reached the limit of submissions");
        require(submissions[msg.sender].minResolveTimestamp == 0, "Submission already created from this address");
        require(_photoHash != 0, "Photo hash can not be empty");
        require(_descriptionHash != 0, "Description hash can not be empty");
        _requestVerificaiton(msg.sender, VERIFICATION_ROUND_SIZE);

        submissions[msg.sender].photoHash = _photoHash;
        submissions[msg.sender].descriptionHash = _descriptionHash;
        submissions[msg.sender].minResolveTimestamp = block.timestamp + MIN_SUBMISSION_DURATION;
        submissions[msg.sender].lockedReward = reward;
        submissions[msg.sender].location = _location;
        submissions[msg.sender].status = SubmissionStatus.Disputed;
        submissionIds.push(msg.sender);
        emit SubmissionCreated(msg.sender);
    }

    // The function can be called only from the creation of a stash campaign.
    //Dummy submission has empty votesOnThis and is forever stuck in Disputed state, but can vote on others.
    function createDummySubmission(address dummySubmitter) public {
        require(msg.sender == campaignCreator, "Only campaign creator can create dummy submissions");
        require(submissions[dummySubmitter].minResolveTimestamp == 0, "Submission already created from this address");
        require(submissionIds.length < maxSubmissions, "Reached the limit of submissions");

        submissions[dummySubmitter].minResolveTimestamp = block.timestamp + MIN_SUBMISSION_DURATION;
        submissions[dummySubmitter].status = SubmissionStatus.Disputed;
        submissionIds.push(dummySubmitter);
        emit SubmissionCreated(dummySubmitter);
    }

    // Transfers all the reward tokens back to the campaign creator once the campaign
    // expiration timestamp is reached. Guarantees that no tokens are lost even if some
    // users don't vote and submissions can not be resolved.
    function recoupCampaignTokens() public {
        require(block.timestamp > campaignExpirationTimestamp, "Campaign has not expired, tokens can not be recouped");

        rewardToken.transfer(campaignCreator, rewardToken.balanceOf(address(this)));
    }

    // Internal function that called after a vote is cast on a submission and a voting round is completed.
    // If the round was unanimous then the submission is finalized. Else a new round is automatically created.
    function _resolveRound(address submissionId) internal {
        uint256 numVotes = submissions[submissionId].votesOnThis.length;
        require(numVotes % VERIFICATION_ROUND_SIZE == 0, "Verification round is not completed");
        require(numVotes >= VERIFICATION_ROUND_SIZE, "Verification round is not completed"); // against some shenanigance with dummy submissions

        // checks that last round was unanimous, % 2 takes care of disputor yes / no
        bool unanimous = true;
        for (uint256 i = numVotes - VERIFICATION_ROUND_SIZE - 1; i < numVotes - 1; i++) {
            if (
                uint256(submissions[submissionId].votesOnThis[i].vote) % 2
                    != uint256(submissions[submissionId].votesOnThis[i + 1].vote) % 2
            ) {
                unanimous = false;
            }
        }

        if (unanimous) {
            if (uint256(submissions[submissionId].votesOnThis[numVotes - 1].vote) % 2 == 0) {
                submissions[submissionId].status = SubmissionStatus.Accepted;
            } else {
                submissions[submissionId].status = SubmissionStatus.Rejected;
            }
            submissions[submissionId].minResolveTimestamp = block.timestamp + DISPUTE_WINDOW;
            emit SubmissionFinalized(
                submissionId, submissions[submissionId].status, submissions[submissionId].minResolveTimestamp
            );
        } else {
            _requestVerificaiton(submissionId, VERIFICATION_ROUND_SIZE);
        }
    }

    // Dispute finalized submission. A disputor deposit should be approved by the user
    // before opening a dispute, it will be transferred to the stash campaign.
    function dispute(address submissionId, bytes32 disputorNotesHash) public {
        require(submissions[submissionId].minResolveTimestamp != 0, "Submission does not exist");
        require(
            submissions[submissionId].status == SubmissionStatus.Accepted
                || submissions[submissionId].status == SubmissionStatus.Rejected,
            "Can dispute only finalized submissions"
        );
        require(
            !proofOfHumanity.checkPoH(submissionId) || submissionId == msg.sender,
            "Can not dispute users with proved proof of humanity"
        );

        rewardToken.transferFrom(msg.sender, address(this), disputDepositAmount);
        if (disputorNotesHash != 0) submissions[submissionId].disputorNotesHashes.push(disputorNotesHash);
        // add opinion contrary to previous consensus and initiate a new round
        VoteOpinion opinion = submissions[submissionId].status == SubmissionStatus.Accepted
            ? VoteOpinion.DisputorNo
            : VoteOpinion.DisputorYes;
        submissions[submissionId].votesOnThis.push(Vote(msg.sender, opinion));
        _requestVerificaiton(submissionId, VERIFICATION_ROUND_SIZE - 1);
        emit Disputed(submissionId, msg.sender);
    }
}
