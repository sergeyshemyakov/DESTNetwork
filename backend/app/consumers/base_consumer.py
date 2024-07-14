from web3 import Web3
import time
from sqlalchemy.orm import scoped_session, sessionmaker


from app.db import engine


class BaseConsumer():

    def __init__(self, provider, contract_address: str, blockchain_name: str) -> None:
        self.provider = provider
        self.w3 = Web3(provider)
        self.contract_address = contract_address
        self.blockchain_name = blockchain_name
        self.event_filter = None
        self.consumer_name = "base_consumer"
        self.session = scoped_session(sessionmaker(bind=engine))()
        self.poll_interval=10
        self.stopped = False
