import web3
import time
from sqlalchemy.orm import scoped_session

from app.db import sessionmaker


class BaseConsumer():

    def __init__(self, provider: web3.BaseProvider, contract_address: str, blockchain_name: str) -> None:
        self.provider = provider
        self.contract_address = contract_address
        self.blockchain_name = blockchain_name
        self.event_filter = None
        self.consumer_name = "base_consumer"
        self.session = scoped_session(sessionmaker)()
        self.poll_interval=5

    def consume(self):
        print(f"Started consumer for {self.consumer_name}, blockchain: {self.blockchain_name}, contract address: {self.contract_address}")
        try:
            while True:
                for event in self.event_filter.get_new_entries():
                    print(f"Event for consumer: {self.consumer_name}, blockchain: {self.blockchain_name},"
                        f" contract address: {self.contract_address}, event: {event}")
                    self.handle_event(event)
                time.sleep(self.poll_interval)
        finally:
            self.session.remove()

    def handle_event(event):
        raise NotImplemented
