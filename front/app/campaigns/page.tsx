import { Block } from "@/components/Block";
import CampaignList from "./components/CampaignList";
import { API } from "@/config/api";

async function getData() {
  const res = await API.get("stash-campaigns/");
  return res.data;
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
