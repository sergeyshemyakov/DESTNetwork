"use client";
import { FC } from "react";
import { CampaignCard } from "./CampaignCard";

interface CampaignListProps {
  campaigns: StashCampaign[];
}

const CampaignList: FC<CampaignListProps> = ({ campaigns }) => {
  return (
    <>
      <div className="flex flex-wrap gap-8 mt-8">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.campaign_id} campaign={campaign} />
        ))}
      </div>
    </>
  );
};

export default CampaignList;
