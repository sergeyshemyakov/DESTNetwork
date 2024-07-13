import { notFound } from "next/navigation";
import CampaignDetails from "./CampaignDetails";

const campaigns: StashCampaign[] = [
  {
    campaign_id: "1",
    description: "Store and distribute essential medicines",
    campaign_creator: "Health Foundation",
    reward: 500,
    reward_token: "ETH",
    campaign_type: 1,
    max_submissions: 100,
    remained_submissions: 50,
    token_symbol: "ETH",
    blockchain: "Ethereum",
    top_left: { lat: 37.7749, long: -122.4194 },
    bottom_right: { lat: 37.7049, long: -122.3494 },
  },
  {
    campaign_id: "2",
    description: "Provide clean water to rural areas",
    campaign_creator: "Water Initiative",
    reward: 300,
    reward_token: "DAI",
    campaign_type: 2,
    max_submissions: 200,
    remained_submissions: 120,
    token_symbol: "DAI",
    blockchain: "Polygon",
    top_left: { lat: 34.0522, long: -118.2437 },
    bottom_right: { lat: 33.9822, long: -118.1737 },
  },
  // Add more campaign objects as needed
];

interface CampaignPageProps {
  params: { campaignId: string };
}

const CampaignPage = ({ params }: CampaignPageProps) => {
  const { campaignId } = params;

  const campaign = campaigns.find((c) => c.campaign_id === campaignId);

  if (!campaign) {
    notFound();
  }
  return <CampaignDetails campaign={campaign} />;
};

export default CampaignPage;
