"use client";
import { FC, useEffect, useState } from "react";
import { CampaignCard } from "./CampaignCard";
import { API } from "@/config/api";
import { useDestAccount } from "@/hooks/useDestAccount";

interface CampaignListProps {
  // campaigns: StashCampaign[];
}

const CampaignList: FC<CampaignListProps> = () => {
  const { account } = useDestAccount();
  const [campaigns, setCampaigns] = useState<StashCampaign[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getData = async () => {
    setIsLoading(true);

    const res = await API.get(`stash-campaigns/?blockchain=${account.chainId}`);

    setCampaigns(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, [account.chainId]);

  return (
    <>
      <div className="flex flex-wrap gap-8 mt-8">
        {isLoading ? (
          <p>Loading...</p>
        ) : campaigns.length ? (
          campaigns.map((campaign) => (
            <CampaignCard key={campaign.campaign_id} campaign={campaign} />
          ))
        ) : (
          <p className="text-lg">
            Ooops. No stash campaigns for the{" "}
            <span className="text-primary">{account.chain?.name}</span> chain
            yet.
          </p>
        )}
      </div>
    </>
  );
};

export default CampaignList;
