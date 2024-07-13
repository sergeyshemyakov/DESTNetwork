import { notFound } from "next/navigation";
import CampaignDetails from "./CampaignDetails";
import { API } from "@/config/api";
import { IsBrowser } from "@dynamic-labs/sdk-react-core";

interface CampaignPageProps {
  params: { compaignId: string };
}

const CampaignPage = async ({ params }: CampaignPageProps) => {
  const { compaignId } = params;
  const { data: campaign } = await API.get(`stash-campaigns/${compaignId}`);

  if (!campaign) {
    notFound();
  }

  return (
    <IsBrowser>
      <CampaignDetails campaign={campaign} />
    </IsBrowser>
  );
};

export default CampaignPage;
