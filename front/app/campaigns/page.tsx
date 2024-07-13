import { Block } from "@/components/Block";
import CampaignList from "./components/CampaignList";

const mockedData = [
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

async function getData() {
  const res = await await fetch(
    "https://dest-network-8617a767d79b.herokuapp.com/api/stash-campaigns/"
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function CampaignsPage() {
  // const campaigns = await getData();
  const campaigns = mockedData;

  return (
    <Block
      title="Explore Stash Campaigns"
      subtitle="Browse the list of active campaigns below to find opportunities to stash resources and earn rewards."
    >
      <CampaignList campaigns={campaigns} />
    </Block>
  );
}
