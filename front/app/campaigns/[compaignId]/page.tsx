import { notFound } from "next/navigation";
import CampaignDetails from "./CampaignDetails";
import { API } from "@/config/api";

interface CampaignPageProps {
  params: { compaignId: string };
}

const CampaignPage = async ({ params }: CampaignPageProps) => {
  const { compaignId } = params;

  if (!compaignId) return;

  return <CampaignDetails compaignId={compaignId} />;
};

export default CampaignPage;
