"use client";
import { Button } from "@nextui-org/button";
import {
  IDKitWidget,
  ISuccessResult,
  VerificationLevel,
} from "@worldcoin/idkit";
import { useWalletClient } from "wagmi";

export const VerifyWallet = () => {
  const wallet = useWalletClient();

  // TODO: Calls your implemented server route
  const verifyProof = async (result: ISuccessResult) => {
    console.log(result);
  };

  // TODO: Functionality after verifying
  const onSuccess = () => {
    console.log("Success");
  };

  // ...

  return (
    <IDKitWidget
      app_id="app_staging_4159351d39ed40966d0dc48bb0554ae5"
      action="verify-wallet"
      // On-chain only accepts Orb verifications
      verification_level={VerificationLevel.Orb}
      handleVerify={verifyProof}
      onSuccess={onSuccess}
    >
      {({ open }) => (
        <div className="flex items-center">
          <Button
            isDisabled={!wallet.isSuccess}
            disabled={!wallet.isSuccess}
            onClick={open}
          >
            Verify with World ID
          </Button>
        </div>
      )}
    </IDKitWidget>
  );
};
