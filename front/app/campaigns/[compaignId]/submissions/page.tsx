import { API } from "@/config/api";
import Submissions from "./Submissions";

interface SubPageProps {
  params: { compaignId: string };
}

export default async function Page({ params }: SubPageProps) {
  const { compaignId } = params;

  if (!compaignId) return null;

  return <Submissions compaignId={compaignId} />;
}
