// SPDX-License-Identifier: MIT
pragma solidity >=0.8.18;

import "@world-id/IWorldID.sol";

// Simple contract that records proof of humanity onchain for destnet users.
// Only supports World ID for now, in future it is possible to connect other PoH.
contract ProofOfHumanity {
    enum ProofOfHumanityEnum {
        None,
        WorldIDOrb
    }

    event addedPoH(address indexed userAddress);

    mapping(address => ProofOfHumanityEnum) public knownPoH;
    /// @dev The World ID group ID (1 for Orb-verified)
    uint256 internal immutable groupId = 1;
    /// @dev The keccak256 hash of the externalNullifier (unique identifier of the action performed), combination of appId and action
    uint256 internal immutable externalNullifierHash;

    /// @dev The address of the World ID Router contract that will be used for verifying proofs
    IWorldID public immutable worldId;

    // Setting the address of world ID in the constructor
    constructor(IWorldID _worldId, string memory _appId, string memory _action) {
        worldId = _worldId;
        externalNullifierHash = hashToField(abi.encodePacked(hashToField(abi.encodePacked(_appId)), _action));
    }

    /// @dev Creates a keccak256 hash of a bytestring.
    /// @param value The bytestring to hash
    /// @return The hash of the specified value
    /// @dev `>> 8` makes sure that the result is included in our field
    function hashToField(bytes memory value) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(value))) >> 8;
    }

    // Returns true if and only if the user has verifier their proof of humanity
    function checkPoH(address userAddress) public view returns (bool) {
        return (knownPoH[userAddress] != ProofOfHumanityEnum.None);
    }

    // Function to register World ID proof of humanity in our dApp
    function addWorldIDPoH(address userAddress, uint256 root, uint256 nullifierHash, uint256[8] calldata proof)
        public
    {
        if (knownPoH[userAddress] != ProofOfHumanityEnum.None) revert("User proof of humanity already verified");

        worldId.verifyProof(
            root,
            groupId,
            hashToField(abi.encodePacked(userAddress)),
            nullifierHash,
            externalNullifierHash, // not sure if this param is correct, example uses externalNullifierHash
            proof
        );

        knownPoH[userAddress] = ProofOfHumanityEnum.WorldIDOrb;
    }
}
