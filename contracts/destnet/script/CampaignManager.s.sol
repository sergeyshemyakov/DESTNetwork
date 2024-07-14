// SPDX-License-Identifier: MIT
pragma solidity >=0.8.18;

import {Script, console2} from "forge-std/Script.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/CampaignManager.sol";
import "../src/DestnetToken.sol";
import "../src/ProofOfHumanity.sol";
import "../src/StashCampaign.sol";

contract ManagerScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address a1 = address(uint160(vm.envUint("ADDRESS_1")));
        address a2 = address(uint160(vm.envUint("ADDRESS_2")));
        address a3 = address(uint160(vm.envUint("ADDRESS_3")));
        address a4 = address(uint160(vm.envUint("ADDRESS_4")));
        address deployer = address(uint160(vm.envUint("DEPLOYER")));
        vm.startBroadcast(deployerPrivateKey);

        // deploy test token
        DestnetToken token = new DestnetToken(1000000 * 10 ** 18, a1, a2, a3, a4, deployer);
        console2.log("Destnet Token address: %s", address(token));
        vm.setEnv("TOKEN_ADDRESS", vm.toString(address(token)));
        address pohAddress = address(uint160(vm.envUint("POH_ADDRESS")));

        // deploy stash campaign
        CampaignManager campaignManager = new CampaignManager(ProofOfHumanity(pohAddress));
        console2.log("Campaign manager address: %s", address(campaignManager));
        vm.setEnv("MANAGER_ADDRESS", vm.toString(address(campaignManager)));

        // create first stash campaign
        StashCampaign campaign = new StashCampaign(
            block.timestamp + 300,
            a1,
            0,
            100,
            10 * 10 ** 18,
            token,
            StashCampaign.Coordinate(50860940, 4307974),
            StashCampaign.Coordinate(50829232, 4358909),
            bytes32(bytes("0xfd87ed11e357c1105af46476db6207eed8d3d9716705bfd2e702554c0b65e3f1")),
            ProofOfHumanity(pohAddress),
            campaignManager,
            10 * 10 ** 18
        );
        // token.approve(address(campaign), 1001 * 10 ** 18);
        bool success = token.transfer(address(campaign), 1000 * 10 ** 18);
        require(success, "Token transfer failed");
        emit CampaignManager.CampaignCreated(address(campaign));

        campaign.createDummySubmission(a2);
        campaign.createDummySubmission(a3);
        campaign.createDummySubmission(a4);

        campaignManager.registerCampaign(address(campaign));
        vm.stopBroadcast();
    }
}
