"use client";

import { Button } from "@nextui-org/button";
import {
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { BiLoaderAlt } from "react-icons/bi";
import { ISuccessResult } from "@worldcoin/idkit";
import { FaCheckCircle } from "react-icons/fa";
import { BaseError, decodeAbiParameters, parseAbiParameters } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { verifyAbi } from "@/config/abi";
import { IsWorldIdVerified } from "./isWorldIdVerified";
import { baseSepolia } from "viem/chains";

export const VerifyWallet = () => {
  const account = useAccount();
  const [isConnected, setIsConnected] = useState(false);
  const [isWorldIdEnabled, setIsWorldIdEnabled] = useState(false);

  const { data: hash, error, writeContractAsync } = useWriteContract();

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });
  const [isDone, setIsDone] = useState<"none" | "progress" | "completed">(
    "none"
  );

  const onSuccess = async (result: ISuccessResult) => {
    if (!account.address) return;

    setIsDone("progress");

    try {
      await writeContractAsync({
        abi: verifyAbi,
        account: account.address,
        address: `0x2F7B383653f907a5f1D1c3ecF98201baa792952F`,
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

      setIsDone("completed");
    } catch (e) {
      throw new Error((e as BaseError).shortMessage);
    }
  };

  useEffect(() => {
    setIsConnected(account.isConnected);
  }, [account.isConnected]);

  useEffect(() => {
    setIsWorldIdEnabled(account.chain?.id === baseSepolia.id);
  }, [account.chain]);

  return (
    <>
      {isWorldIdEnabled ? (
        <>
          {isConnected && account.address && (
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

      <Modal size="md" isOpen={isDone === "progress"}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <h3 className="header-text text-xl flex gap-2 items-center">
                  Verification in progress{" "}
                  <span className="animate-spin text-primary">
                    <BiLoaderAlt />
                  </span>
                </h3>
              </ModalHeader>
              <ModalBody className="pb-4">
                {error ? (
                  <p>Error: {(error as BaseError).message}</p>
                ) : (
                  <>
                    <div className="flex gap-2 items-center">
                      <span className="text-success">
                        <FaCheckCircle />
                      </span>

                      <p className="text-lg">Transaction started</p>
                    </div>

                    <div className="flex gap-2 items-center">
                      <span className={hash ? "text-success" : "animate-spin"}>
                        {hash ? <FaCheckCircle /> : <BiLoaderAlt />}
                      </span>
                      <p className="text-lg">
                        {!hash
                          ? "Getting ransaction hash..."
                          : `Transaction Hash ${hash}`}
                      </p>
                    </div>

                    {hash && (
                      <div className="flex gap-2 items-center">
                        <span
                          className={
                            isConfirmed ? "text-success" : "animate-spin"
                          }
                        >
                          {isConfirmed ? <FaCheckCircle /> : <BiLoaderAlt />}
                        </span>
                        <p className="text-lg">
                          {isConfirmed
                            ? "Transaction confirmed"
                            : "Waiting for confirmation..."}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      {isDone && <ConfettiExplosion />}
    </>
  );
};
