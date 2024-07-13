// SPDX-License-Identifier: MIT
pragma solidity >=0.8.18;

import {Script, console2} from "forge-std/Script.sol";
import "../src/ProofOfHumanity.sol";
import "@world-id/IWorldID.sol";

contract PoHScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        uint256 worldIdAddress = vm.envUint("WORLD_ID");
        vm.startBroadcast(deployerPrivateKey);

        if (worldIdAddress != 0) {
            IWorldID worldId = IWorldID(address(uint160(worldIdAddress)));
            ProofOfHumanity poh =
                new ProofOfHumanity(worldId, "app_staging_4159351d39ed40966d0dc48bb0554ae5", "verify-wallet");
            console2.log("PoH address: %s", address(poh));
            vm.setEnv("POH_ADDRESS", vm.toString(address(poh)));
        } else {
            console2.log("No WORLD_ID was given, no PoH is created");
            vm.setEnv("POH_ADDRESS", "0x0");
        }

        vm.stopBroadcast();
    }
}
