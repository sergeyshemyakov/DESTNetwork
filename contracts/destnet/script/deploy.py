import json
import os

privateKey = ""

json_networks = []
d = []

with open('../env.json') as json_data:
    d = json.load(json_data)
    privateKey = d["privateKey"]
    json_networks = d["networks"] 

os.chdir("..")
# network = json_networks["zircuit_testnet"]
network = json_networks["base_sepolia"]

os.environ["PRIVATE_KEY"] = privateKey
os.environ["ADDRESS_1"] = d["campaignCreatorAddress"]
os.environ["ADDRESS_2"] = d["dummy1Address"]
os.environ["ADDRESS_3"] = d["dummy2Address"]
os.environ["ADDRESS_4"] = d["dummy3Address"]
os.environ["WORLD_ID"] = network["world_id"]

chain_id = network["chain_id"]
rpc_url = network["rpc_url"]
etherscan_key = network["etherscan_key"]
verifier_rpc = network["verifier_rpc"]


# deploy PoH
command = f"forge script script/ProofOfHumanity.s.sol:PoHScript --chain-id {chain_id} --rpc-url {rpc_url} --etherscan-api-key {etherscan_key} --verifier-url {verifier_rpc} --broadcast --verify -vvvv"
# command = f"forge script script/ProofOfHumanity.s.sol:PoHScript --chain-id {chain_id} --rpc-url {rpc_url} --etherscan-api-key {etherscan_key} --broadcast --verify -vvvv"
# print(command)
# os.system(command)

os.environ["POH_ADDRESS"] = "0x2F7B383653f907a5f1D1c3ecF98201baa792952F"
# os.environ["POH_ADDRESS"] = "0x0"

# deploy token, campaign manager and initial stash campaign
command = f"forge script script/CampaignManager.s.sol:ManagerScript --chain-id {chain_id} --rpc-url {rpc_url} --etherscan-api-key {etherscan_key} --verifier-url {verifier_rpc} --broadcast --verify -vvvv"
# print(command)
os.system(command)

# command = f'forge verify-contract 0x68C284CFA04fE1789EFBE126D8Db1E17E9a2E445 --watch --compiler-version "v0.8.26+commit.8a97fa7a" --verifier-url {verifier_rpc} --api-key {etherscan_key} src/StashCampaign.sol:StashCampaign --optimizer-runs 200 --chain-id {chain_id}'
# --constructor-args $(cast abi-encode "constructor(uint256,address,uint256,uint256,uint256,address,tuple(int256,int256),tuple(int256,int256),bytes32,address,address,uint256)" "" "FUSD" 18 1000000000000000000000)
# print(command)
# os.system(command)

# command = f"forge script script/StashCampaign.s.sol:TestScript --chain-id {chain_id} --rpc-url {rpc_url} --etherscan-api-key {etherscan_key} --verifier-url {verifier_rpc} --broadcast --verify -vvvv"
# os.system(command)