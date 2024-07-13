// SPDX-License-Identifier: MIT
pragma solidity >=0.8.18;

import {Script, console2} from "forge-std/Script.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/CampaignManager.sol";
import "../src/DestnetToken.sol";
import "../src/ProofOfHumanity.sol";
import "../src/StashCampaign.sol";

contract TestScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        StashCampaign campaign = new StashCampaign(
            1720887300,
            address(0xabadc4402C14844431fC7521613b6922c7bdde80),
            0,
            10,
            10 * 10 ** 18,
            DestnetToken(address(0x33d68CA687f49c2b6CEa605C1B4783652358c722)),
            StashCampaign.Coordinate(40712776, -74005974),
            StashCampaign.Coordinate(34052235, -118243683),
            bytes32(abi.encodePacked("0x33f093c29ead7a1374e746274db35a52d3adfebadd4070515d6661e31fa24649")),
            ProofOfHumanity(address(0xF630C81DE5b353dA3cf2cF35e901d018Dd96668C)),
            CampaignManager(address(0xcDB2223C6Be2F0C233f1BD20AA5Ecf6Ac44FAD74)),
            10 * 10 ** 18
        );

        console2.log("Campaign address: %s", address(campaign));

        vm.stopBroadcast();
    }
}
