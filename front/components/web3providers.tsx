"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

export interface Web3ProvidersProps {
  children: React.ReactNode;
}

export function Web3Providers({ children }: Web3ProvidersProps) {
  const { theme } = useTheme();

  return (
    <DynamicContextProvider
      theme={theme === "light" ? "light" : "dark"}
      settings={{
        environmentId: "d730cba1-78e5-45b4-8cf1-a416c3c616ac",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}
