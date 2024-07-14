"use client";
import { ProgressModal } from "@/components/ProgressModal";
import { submissionCreateAbi } from "@/config/abi";
import { submissionCreateAddress } from "@/config/addresses";
import { API } from "@/config/api";
import { useDestAccount } from "@/hooks/useDestAccount";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  Textarea,
} from "@nextui-org/react";
import { FC, FormEventHandler, useState } from "react";
import { FaRetweet } from "react-icons/fa";
import { useWriteContract } from "wagmi";

export const ReopenDispute: FC<{
  submission: Submission;
  onSuccess: () => void;
}> = ({ submission, onSuccess }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isConnected, account } = useDestAccount();
  const { data: hash, error, writeContractAsync } = useWriteContract();

  const [status, setStatus] = useState<"none" | "progress" | "completed">(
    "none"
  );
  const [description, setDescription] = useState("");
  const [isReopeningDispute, setIsReopeningDispute] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      setStatus("progress");

      const { data: enDesc } = await API.post("descriptions", {
        content: description,
      });

      await writeContractAsync({
        abi: submissionCreateAbi,
        account: account.address,
        address: submissionCreateAddress,
        functionName: "dispute",
        args: [submission.submission_id as `0x${string}`, `0x${enDesc.hash}`],
      });

      onSuccess();
      setTimeout(() => {
        setStatus("completed");
        onClose();
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
        color="warning"
        startContent={<FaRetweet />}
        onClick={onOpen}
      >
        Reopen dispute
      </Button>

      <Modal backdrop="blur" size="md" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3 className="header-text">Reopen dispute</h3>
              </ModalHeader>
              <ModalBody className="pb-4">
                <form onSubmit={handleSubmit}>
                  <Textarea
                    required
                    labelPlacement="outside"
                    variant="bordered"
                    rows={4}
                    value={description}
                    label="Why do you want to reopen dispute?"
                    className="mb-4"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="light"
                      disabled={isReopeningDispute}
                      type="button"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      isLoading={isReopeningDispute}
                      disabled={isReopeningDispute}
                      type="submit"
                    >
                      Reopen
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <ProgressModal
        title="Accepting the submission"
        hash={hash}
        error={error}
        status={status}
      />
    </>
  );
};
