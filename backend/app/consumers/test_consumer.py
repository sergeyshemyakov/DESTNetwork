from web3 import Web3
import json
import asyncio
import time



provider = Web3.HTTPProvider("")
w3 = Web3(provider)

contract_address = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
ABI = """[{
    "anonymous": false,
    "inputs": [
        {
            "indexed": true,
            "internalType": "address",
            "name": "campaign",
            "type": "address"
        }
    ],
    "name": "CampaignCreated",
    "type": "event"
}]"""
print("creating contract and filter")
# contract = w3.eth.contract(address=contract_address, abi=json.loads(ABI))

# event_filter = contract.events.CampaignCreated.create_filter(fromBlock="latest")
event_filter = w3.eth.filter("latest")


def handle_event(event):
    print(event)


while True:
    print("IN LOOP")
    for event in event_filter.get_new_entries():
        handle_event(event)
    time.sleep(10)
