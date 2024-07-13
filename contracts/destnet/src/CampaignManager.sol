// SPDX-License-Identifier: MIT
pragma solidity >=0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./StashCampaign.sol";
import "./ProofOfHumanity.sol";

contract CampaignManager {
    uint256 public immutable CAMPAIGN_DURATION = 300; // should be 31536000 = 1 year for non-hack version
    uint256 public immutable DISPUT_DEPOSIT_AMOUNT = 10 * 10 ** 18; // should be read from front end for non-hack version

    event CampaignCreated(address indexed campaign);

    ProofOfHumanity public immutable proofOfHumanity;
    address[] public campaigns;

    constructor(ProofOfHumanity _proofOfHumanity) {
        proofOfHumanity = _proofOfHumanity;
    }

    // Function creates a new campaign with given params. Tokens are automatiaclly transferred
    // from the campaign creator, in total reward * maxSubmissions. Together with the campaign,
    // three dummy verifiers are created to verify initial submissions
    function createCampaign(
        uint256 category,
        uint256 maxSubmissions,
        uint256 reward,
        IERC20 rewardToken,
        StashCampaign.Coordinate memory topLeft,
        StashCampaign.Coordinate memory bottomRight,
        bytes32 descriptionHash,
        address dummy1,
        address dummy2,
        address dummy3
    ) public {
        require(
            rewardToken.balanceOf(msg.sender) >= reward * maxSubmissions,
            "Insufficient balance to initialize stash campaign"
        );
        StashCampaign campaign = new StashCampaign(
            block.timestamp + CAMPAIGN_DURATION,
            msg.sender,
            category,
            maxSubmissions,
            reward,
            rewardToken,
            topLeft,
            bottomRight,
            descriptionHash,
            proofOfHumanity,
            this,
            DISPUT_DEPOSIT_AMOUNT
        );

        campaigns.push(address(campaign));
        // fund newly created stash campaign
        bool success = rewardToken.transferFrom(msg.sender, address(campaign), reward * maxSubmissions);
        require(success, "Token transfer failed");

        emit CampaignCreated(address(campaign));

        // create three dummy submissions
        campaign.createDummySubmission(dummy1);
        campaign.createDummySubmission(dummy2);
        campaign.createDummySubmission(dummy3);
    }
}
