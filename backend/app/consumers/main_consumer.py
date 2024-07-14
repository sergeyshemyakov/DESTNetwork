from dotenv import load_dotenv
load_dotenv()


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
        "blockchain": "Base Sepolia",
        "campaign_manager_address": "0x83f17DD98e20b63B8d2d33bAf7a4074E302e3C25",
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
    while not killer.kill_now and all(x.stopped == False for x in main_consumers):
        time.sleep(1)
finally:
    print("Virybamesya pacani")
    for consumer in main_consumers:
       consumer.stopped = True
    for thread in main_threads:
        thread.stopped = True
        thread.join()
