import { Block } from "@/components/Block";
import CampaignList from "./components/CampaignList";

export default async function CampaignsPage() {
  return (
    <Block
      title="Explore Stash Campaigns"
      subtitle="Browse the list of active campaigns below to find opportunities to stash resources and earn rewards."
    >
      <CampaignList />
    </Block>
  );
}
