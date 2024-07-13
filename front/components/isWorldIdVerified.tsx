"use client";

import { FC, useEffect, useState } from "react";
import { verifyAbi } from "@/config/abi";
import { Button } from "@nextui-org/button";
import {
  IDKitWidget,
  ISuccessResult,
  VerificationLevel,
} from "@worldcoin/idkit";
import { useReadContract } from "wagmi";
import { Chip } from "@nextui-org/react";
import { FaCheckCircle } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";

export const IsWorldIdVerified: FC<{
  address: string;
  onSuccess: (result: ISuccessResult) => void;
}> = ({ address, onSuccess }) => {
  const result = useReadContract({
    abi: verifyAbi,
    address: "0x2F7B383653f907a5f1D1c3ecF98201baa792952F",
    functionName: "checkPoH",
    args: [address as `0x${string}`],
  });

  const [status, setStatus] = useState<"pending" | "verified" | "not verified">(
    "pending"
  );

  useEffect(() => {
    if (result.isFetched) {
      setStatus(result.data ? "verified" : "not verified");
    }
  }, [result.isFetched]);

  return (
    <>
      {status === "not verified" ? (
        <IDKitWidget
          app_id="app_staging_4159351d39ed40966d0dc48bb0554ae5"
          action="verify-wallet"
          signal={address}
          verification_level={VerificationLevel.Orb}
          onSuccess={onSuccess}
          autoClose
        >
          {({ open }) => (
            <div className="flex items-center">
              <Button onClick={open}>Verify with World ID</Button>
            </div>
          )}
        </IDKitWidget>
      ) : (
        <div className="flex items-center">
          {status === "verified" ? (
            <Chip
              size="lg"
              variant="bordered"
              color="primary"
              startContent={<FaCheckCircle />}
            >
              Verified with World ID
            </Chip>
          ) : (
            <>
              <Chip
                size="lg"
                startContent={
                  <span className="animate-spin">
                    <BiLoaderAlt />
                  </span>
                }
              >
                Checking address...
              </Chip>
            </>
          )}
        </div>
      )}
    </>
  );
};
