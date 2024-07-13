from app.consumers.base_consumer import BaseConsumer


class CampaignCreatedEventConsumer(BaseConsumer):

    def __init__(self, *args, **kwargs) -> None:
        super.__init__(*args, **kwargs)
        self.consumer_name = "CampaignCreatedConsumer"