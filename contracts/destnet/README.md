## Onchain logic

Blockchain component of DEST Network consists of 4 smart contracts:

- [DestnetToken.sol](./src/DestnetToken.sol) is a ERC-20 token created to simplify testing.
- [ProofOfHumanity.sol](./src/ProofOfHumanity.sol) is an onchain registry of users verified with proofs of humanity for more relaxed requirements. Currently only works with World ID on chains where World ID is supported.
- [CampaignManager.sol](./src/CampaignManager.sol) is a single point of reference for all Stash Campaigns.
- [StashCampaign.sol](./src/StashCampaign.sol) represents instances of stash campaigns. Each Stash Campaign smart contract manages the lifecycle of stash submissions, including all voting logic. 

## ProofOfHumanity

Currently has a function to verify a user with onchain World ID. After a user is verified, their submissions can not be disputed by other users.

## CampaignManager

Campaign Manager provides an intergace to create Stash Campaigns by giving all necessary data and transferring ERC-20 reward tokens to the campaign.

## StashCampaign

### Submit Stash

Stash campaign allows creating stashes with all necessary data. When a stash is created, verifiers are randomly assigned from the existing submitters.

### Vote on submissions

Users are automatically assigned submission, on which they must vote. They must cast all required votes to receive their reward.

### Dispute

After a submission is finalized (i.e. accepted or rejected), it has a dispute period in which everyone can dispute the decision by locking a deposit. Disputing provides an option for independent observers to secure DEST Network.

### Resolve submission and manage penalties and rewards

After the dispute period, the submission can be resolved. Then every incorrect voter, disputor and fault submitter is penalized, and these tokens are shared among all correct voters and disputors. This onchain logic creates socio-economic incentives to vote correctly and open disputes if an incorrect decision is observed.
