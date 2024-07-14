"use client";
import { Chip } from "@nextui-org/react";
import { ISuccessResult } from "@worldcoin/idkit";
import { BaseError, decodeAbiParameters, parseAbiParameters } from "viem";
import { useWriteContract } from "wagmi";
import { useState } from "react";
import { verifyAbi } from "@/config/abi";
import { IsWorldIdVerified } from "./isWorldIdVerified";
import { verifyContractAddress } from "@/config/addresses";
import { useDestAccount } from "@/hooks/useDestAccount";
import { ProgressModal } from "./ProgressModal";

export const VerifyWallet = () => {
  const { account, isConnected, isWorldIdEnabled, confirmVerification } =
    useDestAccount();
  const { data: hash, error, writeContractAsync } = useWriteContract();

  const [status, setStatus] = useState<"none" | "progress" | "completed">(
    "none"
  );

  const onSuccess = async (result: ISuccessResult) => {
    if (!account.address) return;

    setStatus("progress");

    try {
      await writeContractAsync({
        abi: verifyAbi,
        account: account.address,
        address: verifyContractAddress,
        functionName: `addWorldIDPoH`,
        args: [
          account.address,
          BigInt(result.merkle_root),
          BigInt(result.nullifier_hash),
          decodeAbiParameters(
            parseAbiParameters(`uint256[8]`),
            result!.proof as `0x${string}`
          )[0],
        ],
      });

      confirmVerification();
      setTimeout(() => {
        setStatus("completed");
      }, 1000);
    } catch (e) {
      throw new Error((e as BaseError).shortMessage);
    }
  };

  return (
    <>
      {isConnected && (
        <>
          {isWorldIdEnabled ? (
            <>
              {account.address && (
                <IsWorldIdVerified
                  address={account.address}
                  onSuccess={onSuccess}
                />
              )}
            </>
          ) : (
            <div className="flex items-center">
              <Chip variant="dot" color="warning">
                WorldID unavailable
              </Chip>
            </div>
          )}
        </>
      )}

      <ProgressModal
        title="Verification in progress"
        hash={hash}
        error={error}
        status={status}
      />
    </>
  );
};
