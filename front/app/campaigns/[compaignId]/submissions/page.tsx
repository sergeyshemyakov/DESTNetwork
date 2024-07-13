import Submissions from "./Submissions";

interface SubPageProps {
  params: { compaignId: string };
}

export default function Page({ params }: SubPageProps) {
  return <Submissions campaignId={params.compaignId} />;
}
