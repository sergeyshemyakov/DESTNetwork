import { Block } from "@/components/Block";
import CampaignList from "./components/CampaignList";

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
  const campaigns = await getData();

  return (
    <Block
      title="Explore Stash Campaigns"
      subtitle="Browse the list of active campaigns below to find opportunities to stash resources and earn rewards."
    >
      <CampaignList campaigns={campaigns} />
    </Block>
  );
}
