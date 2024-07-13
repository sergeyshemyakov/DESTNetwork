interface StashCampaign {
  campaign_id: string;
  description: string;
  campaign_creator: string;
  reward: number;
  reward_token: string;
  campaign_type: number;
  max_submissions: number;
  remained_submissions: number;
  token_symbol: string;
  blockchain: string;
  top_left: {
    lat: number;
    long: number;
  };
  bottom_right: {
    lat: number;
    long: number;
  };
}
