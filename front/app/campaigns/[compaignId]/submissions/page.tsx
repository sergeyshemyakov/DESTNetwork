import { IsBrowser } from "@dynamic-labs/sdk-react-core";
import Submissions from "./Submissions";

interface SubPageProps {
  params: { compaignId: string };
}

export default function Page({ params }: SubPageProps) {
  return (
    <IsBrowser>
      <Submissions campaignId={params.compaignId} />
    </IsBrowser>
  );
}
