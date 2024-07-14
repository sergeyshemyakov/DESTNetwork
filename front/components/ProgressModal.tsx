"use client";

import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import React, { FC } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { BiLoaderAlt } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { BaseError } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";

export const ProgressModal: FC<{
  title: string;
  status: "none" | "progress" | "completed";
  error: any;
  hash: `0x${string}` | undefined;
}> = ({ title, status, hash, error }) => {
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  return (
    <Modal backdrop="blur" size="md" isOpen={status === "progress"}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <h3 className="header-text text-xl flex gap-2 items-center">
                {title}{" "}
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
                          : "Waiting for transaction confirmation..."}
                      </p>
                      {isConfirmed && <ConfettiExplosion />}
                    </div>
                  )}
                </>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
