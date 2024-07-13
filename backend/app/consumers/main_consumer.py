from web3 import Web3
import json
import asyncio

from app.db import SessionLocal

session = SessionLocal()

provider = Web3.HTTPProvider("https://rpc2.sepolia.org")
w3 = Web3(provider)

contract_address = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
ABI = """[
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        }
    ]
    """
print("creating contract and filter")
contract = w3.eth.contract(address=contract_address, abi=json.loads(ABI))

event_filter = contract.events.Transfer.create_filter(fromBlock="latest")


def handle_event(event):
    print(event)
    trx = Transaction(
        from_address=event['args']['from'],
        to_address=event['args']['to'],
        value=event['args']['value'],
        transaction_hash=event['transactionHash'].hex()
    )
    session.add(trx)
    session.commit()


async def log_loop(filter, interval):
    while True:
        for event in filter.get_new_entries():
            handle_event(event)
        await asyncio.sleep(interval)


print("start consumption")

loop = asyncio.get_event_loop()
try:
    loop.run_until_complete(asyncio.gather(log_loop(event_filter, 10)))
finally:
    loop.close()
