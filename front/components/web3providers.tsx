"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { arbitrumSepolia, baseSepolia, mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { FC, PropsWithChildren } from "react";
import { useTheme } from "next-themes";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [baseSepolia, arbitrumSepolia],
    transports: {
      // RPC URL for each chain
      [baseSepolia.id]: http(
        `https://base-sepolia.g.alchemy.com/v2/ALxyjRhKa-wHbPwix-exGkvwT_xUnDlE`
      ),
      [arbitrumSepolia.id]: http(
        `https://arbitrum-sepolia.blockpi.network/v1/rpc/public`
      ),
    },

    // Required API Keys
    walletConnectProjectId: "f676206c9f885c49dd47f1f2a09e4ff5",

    // Required App Info
    appName: "DEST Network",

    // Optional App Info
    // appDescription: "Your App Description",
    // appUrl: "https://family.co", // your app's url
    // appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const queryClient = new QueryClient();

export const Web3Providers: FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useTheme();

  const mode = theme === "light" ? "light" : "dark";
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider mode={mode}>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
