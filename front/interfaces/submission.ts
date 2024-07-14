interface Submission {
  campaign_id: string;
  description: string;
  id: number;
  lat: number;
  long: number;
  photo_url: string;
  status: number;
  submission_id: string;
  state: "Finalized" | "To verify" | "Resolved" | "Disputed";
}
