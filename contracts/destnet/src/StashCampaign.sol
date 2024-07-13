// SPDX-License-Identifier: MIT
pragma solidity >=0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ProofOfHumanity.sol";

contract StashCampaign {
    uint256 immutable MIN_SUBMISSION_DURATION = 120; // should be 7776000 = 3 months for non-hack version
    uint8 immutable VERIFICATION_ROUND_SIZE = 3; // could be bigger for non-hack version
    uint256 immutable DISPUTE_WINDOW = 60; // should be 1209600 = 2 weeks for non-hack version
    uint256 MAX_INT = 115792089237316195423570985008687907853269984665640564039457584007913129639935;

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

    modifier submissionExists(address submissionId) {
        require(submissions[submissionId].minResolveTimestamp != 0, "Submission does not exist");
        _;
    }

    modifier submissionFinal(address submissionId) {
        require(
            submissions[submissionId].status == SubmissionStatus.Accepted
                || submissions[submissionId].status == SubmissionStatus.Rejected,
            "Submission is not finalized"
        );
        _;
    }

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
    function dispute(address submissionId, bytes32 disputorNotesHash)
        public
        submissionExists(submissionId)
        submissionFinal(submissionId)
    {
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

    // Function fot msg.sender to vote on submission Id. Can only be called if msg.sender
    // was requested to vote on submission Id and if they have not voted previously.
    function vote(address submissionId, VoteOpinion opinion)
        public
        submissionExists(submissionId)
        submissionExists(msg.sender)
    {
        require(opinion == VoteOpinion.Yes || opinion == VoteOpinion.No, "Can vote only Yes or No");

        // check that msg.sender was requiered to vote on submission and has not voted yet
        uint256 reqVoteIndex = MAX_INT;
        for (uint256 i = 0; i < submissions[msg.sender].requestedVotes.length; i++) {
            if (submissions[msg.sender].requestedVotes[i].id == submissionId) {
                reqVoteIndex = i;
                continue;
            }
        }
        require(reqVoteIndex != MAX_INT, "Can only vote on submissions where the vote was requested");
        require(
            submissions[msg.sender].requestedVotes[reqVoteIndex].voted = false, "Can not vote twice on a submission"
        );

        // set that msg.sender has voted
        submissions[msg.sender].requestedVotes[reqVoteIndex].voted = true;
        // add the vote decision to the submission
        submissions[submissionId].votesOnThis.push(Vote(msg.sender, opinion));
        emit Voted(submissionId, msg.sender);

        // if the last voter in round, proceed with the submission
        if (submissions[submissionId].votesOnThis.length % VERIFICATION_ROUND_SIZE == 0) {
            _resolveRound(submissionId);
        }
    }

    // Function to resolve a submission, i.e. to make it impossible to interact with it anymore
    // and manage all related rewards and penalties
    function resolve(address submissionId) public submissionExists(submissionId) submissionFinal(submissionId) {
        require(
            block.timestamp >= submissions[submissionId].minResolveTimestamp, "Min resolve timestamp is not reached"
        );
        // check that all required votes are cast
        for (uint256 i = 0; i < submissions[submissionId].requestedVotes.length; i++) {
            require(
                submissions[submissionId].requestedVotes[i].voted,
                "Can resolve submission only after all requered votes are cast"
            );
        }

        // take all penalties and share among all correct voters
        if (submissions[submissionId].status == SubmissionStatus.Accepted) {
            rewardToken.transfer(submissionId, submissions[submissionId].lockedReward);
            submissions[submissionId].lockedReward = 0;
            uint256 penalty = 0;
            uint256 yesVotersCount = 0;
            // deduce penalties from no voters
            for (uint256 i = 0; i < submissions[submissionId].votesOnThis.length; i++) {
                Vote memory _vote = submissions[submissionId].votesOnThis[i];
                // incorrect disputors lose full deposit
                if (_vote.vote == VoteOpinion.DisputorNo) {
                    penalty += disputDepositAmount;
                }
                // incorrect voters lose half of locked rewards
                else if (_vote.vote == VoteOpinion.No) {
                    penalty = submissions[_vote.verifier].lockedReward / 2;
                    submissions[_vote.verifier].lockedReward /= 2;
                } else {
                    yesVotersCount++;
                }
            }
            // pay out rewards to yes voters
            uint256 share = penalty / yesVotersCount;
            for (uint256 i = 0; i < submissions[submissionId].votesOnThis.length; i++) {
                Vote memory _vote = submissions[submissionId].votesOnThis[i];
                // correct disputor receives deposit + their share of penalty tokens
                if (_vote.vote == VoteOpinion.DisputorYes) {
                    rewardToken.transfer(_vote.verifier, share + disputDepositAmount);
                }
                // correct voter receives their share of penalty. It is transferred
                // as locked reward or transferred directly, depending on whether the
                // voter already resolved their submission
                if (_vote.vote == VoteOpinion.Yes) {
                    if (submissions[_vote.verifier].lockedReward == 0) {
                        rewardToken.transfer(_vote.verifier, share);
                    } else {
                        submissions[_vote.verifier].lockedReward += share;
                    }
                }
            }
        } else {
            // submitter loses full reward
            uint256 penalty = submissions[submissionId].lockedReward;
            uint256 noVotersCount = 0;
            // deduce penalties from yes voters
            for (uint256 i = 0; i < submissions[submissionId].votesOnThis.length; i++) {
                Vote memory _vote = submissions[submissionId].votesOnThis[i];
                // incorrect disputors lose full deposit
                if (_vote.vote == VoteOpinion.DisputorYes) {
                    penalty += disputDepositAmount;
                }
                // incorrect voters lose half of locked rewards
                else if (_vote.vote == VoteOpinion.Yes) {
                    penalty = submissions[_vote.verifier].lockedReward / 2;
                    submissions[_vote.verifier].lockedReward /= 2;
                } else {
                    noVotersCount++;
                }
            }
            // pay out rewards to no voters
            uint256 share = penalty / noVotersCount;
            for (uint256 i = 0; i < submissions[submissionId].votesOnThis.length; i++) {
                Vote memory _vote = submissions[submissionId].votesOnThis[i];
                // correct disputor receives deposit + their share of penalty tokens
                if (_vote.vote == VoteOpinion.DisputorNo) {
                    rewardToken.transfer(_vote.verifier, share + disputDepositAmount);
                }
                // correct voter receives their share of penalty. It is transferred
                // as locked reward or directly, depending on whether the
                // voter already resolved their submission
                if (_vote.vote == VoteOpinion.No) {
                    if (submissions[_vote.verifier].lockedReward == 0) {
                        rewardToken.transfer(_vote.verifier, share);
                    } else {
                        submissions[_vote.verifier].lockedReward += share;
                    }
                }
            }
        }
        submissions[submissionId].status = SubmissionStatus.Resolved;
        emit Resolved(submissionId);
    }
}
