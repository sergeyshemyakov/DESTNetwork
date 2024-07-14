import { useCallback, useEffect, useState } from "react";
import { baseSepolia } from "viem/chains";
import { useAccount } from "wagmi";

export const useDestAccount = () => {
  const account = useAccount();
  const [isConnected, setIsConnected] = useState(false);
  const [isWorldIdEnabled, setIsWorldIdEnabled] = useState(false);

  const confirmVerification = useCallback(() => {
    setIsWorldIdEnabled(true);
  }, []);

  useEffect(() => {
    setIsConnected(account.isConnected);
  }, [account.isConnected]);

  useEffect(() => {
    setIsWorldIdEnabled(account.chain?.id === baseSepolia.id);
  }, [account.chain]);

  return { account, isConnected, isWorldIdEnabled, confirmVerification };
};
