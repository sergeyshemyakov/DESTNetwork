"use client";
import { ProgressModal } from "@/components/ProgressModal";
import { submissionCreateAbi } from "@/config/abi";
import { submissionCreateAddress } from "@/config/addresses";
import { useDestAccount } from "@/hooks/useDestAccount";
import { Button } from "@nextui-org/button";
import { FC, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useWriteContract } from "wagmi";

export const DeclineSubmission: FC<{ submission: Submission }> = ({
  submission,
}) => {
  const { isConnected, account } = useDestAccount();
  const { data: hash, error, writeContractAsync } = useWriteContract();

  const [status, setStatus] = useState<"none" | "progress" | "completed">(
    "none"
  );

  const handleSubmit = async () => {
    try {
      setStatus("progress");

      await writeContractAsync({
        abi: submissionCreateAbi,
        account: account.address,
        address: submissionCreateAddress,
        functionName: "vote",
        args: [submission.submission_id as `0x${string}`, 2],
      });

      setTimeout(() => {
        setStatus("completed");
      }, 1000);
    } catch (e) {
      alert("Oooops. No success. try again.");
      setStatus("none");
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="bordered"
        color="danger"
        startContent={<FaTimes />}
        isDisabled={!isConnected}
        disabled={!isConnected}
        onClick={handleSubmit}
      >
        Decline
      </Button>

      <ProgressModal
        title="Declining the submission"
        hash={hash}
        error={error}
        status={status}
      />
    </>
  );
};
