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
        vm.startBroadcast(deployerPrivateKey);

        // deploy test token
        DestnetToken token = new DestnetToken(100000 * 10 ** 18, a1, a2, a3, a4);
        console2.log("Destnet Token address: %s", address(token));
        vm.setEnv("TOKEN_ADDRESS", vm.toString(address(token)));
        address pohAddress = address(uint160(vm.envUint("POH_ADDRESS")));

        // deploy stash campaign
        CampaignManager campaignManager = new CampaignManager(ProofOfHumanity(pohAddress));
        console2.log("Campaign manager address: %s", address(campaignManager));
        vm.setEnv("MANAGER_ADDRESS", vm.toString(address(campaignManager)));

        // create first stash campaign
        token.approve(address(campaignManager), 100 * 10 ** 18);
        campaignManager.createCampaign(
            0,
            10,
            10 * 10 ** 18,
            token,
            StashCampaign.Coordinate(40712776, 74005974),
            StashCampaign.Coordinate(34052235, 118243683),
            bytes32(abi.encodePacked("0x33f093c29ead7a1374e746274db35a52d3adfebadd4070515d6661e31fa24649")),
            a2,
            a3,
            a4
        );

        vm.stopBroadcast();
    }
}
