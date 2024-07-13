import { notFound } from "next/navigation";
import CampaignDetails from "./CampaignDetails";
import { API } from "@/config/api";

interface CampaignPageProps {
  params: { compaignId: string };
}

const CampaignPage = async ({ params }: CampaignPageProps) => {
  const { compaignId } = params;
  const { data: campaign } = await API.get(`stash-campaigns/${compaignId}`);

  if (!campaign) {
    notFound();
  }
  return <CampaignDetails campaign={campaign} />;
};

export default CampaignPage;
