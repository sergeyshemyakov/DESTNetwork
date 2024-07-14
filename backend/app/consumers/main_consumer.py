from web3 import Web3
import time
import signal

from app.consumers.campaign_created import CampaignCreatedEventConsumer
import os
import threading

class GracefulKiller:
  kill_now = False
  def __init__(self):
    signal.signal(signal.SIGINT, self.exit_gracefully)
    signal.signal(signal.SIGTERM, self.exit_gracefully)

  def exit_gracefully(self, signum, frame):
    self.kill_now = True

sepolia_key = os.environ.get("BASE_SEPOLIA_RPC_KEY")

CONFIGURATION =[
    {
        "blockchain": "Sepolia Base",
        "campaign_manager_address": "0xcDB2223C6Be2F0C233f1BD20AA5Ecf6Ac44FAD74",
        "provider_url": f"https://base-sepolia.g.alchemy.com/v2/{sepolia_key}"
    }
]

main_threads = []
main_consumers = []
try:
    killer = GracefulKiller()
    for config in CONFIGURATION:
        provider = Web3.HTTPProvider(config["provider_url"])

        campaign_created_consumer = CampaignCreatedEventConsumer(
            provider,
            config["campaign_manager_address"],
            config["blockchain"]
        )

        t1 = threading.Thread(target=campaign_created_consumer.consume)
        t1.setDaemon(True)
        main_threads.append(t1)
        main_consumers.append(campaign_created_consumer)
        t1.start()
    while not killer.kill_now:
        time.sleep(1)
finally:
    for consumer in main_consumers:
       consumer.stopped = True
    for thread in main_threads:
        thread.stopped = True
        thread.join()