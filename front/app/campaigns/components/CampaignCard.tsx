"use client";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Button, Chip, Divider, Image, Progress } from "@nextui-org/react";
import { FC } from "react";
import { MdOutlineArrowOutward } from "react-icons/md";

interface CampaignCardProps {
  campaign: StashCampaign;
  onDetails: () => void;
}

const compaignTypes: Record<number, string> = {
  1: "Supplies",
  2: "Medicine",
};

export const CampaignCard: FC<CampaignCardProps> = ({
  campaign,
  onDetails,
}) => {
  return (
    <Card className="w-[320px]">
      <CardHeader className="w-full flex justify-between">
        <div className="flex gap-2 items-center">
          <Image
            alt="nextui logo"
            height={40}
            radius="sm"
            src="med.png"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-lg header-text">
              {compaignTypes[campaign.campaign_type]}
            </p>
            <p className="text-small text-default-500">
              {campaign.campaign_creator}
            </p>
          </div>
        </div>

        <p className="text-lg text-primary text-right">
          {campaign.reward}
          <span className="text-sm">{campaign.token_symbol}</span>
        </p>
      </CardHeader>
      <CardBody>
        <div></div>
        <Progress
          label="Stashes available"
          size="sm"
          value={campaign.max_submissions - campaign.remained_submissions}
          maxValue={campaign.max_submissions}
          color="primary"
          valueLabel={
            <>
              <span>{campaign.remained_submissions}</span>
              <span className="text-gray-500">/{campaign.max_submissions}</span>
            </>
          }
          showValueLabel
          className="max-w-md"
        />
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-end">
        <Button
          variant="light"
          color="primary"
          size="sm"
          endContent={<MdOutlineArrowOutward />}
          onClick={onDetails}
        >
          More details
        </Button>
      </CardFooter>
    </Card>
  );
};
