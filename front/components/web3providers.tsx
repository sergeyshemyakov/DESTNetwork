"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import {
  arbitrumSepolia,
  baseSepolia,
  rootstockTestnet,
  scrollSepolia,
  zircuitTestnet,
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { FC, PropsWithChildren } from "react";
import { useTheme } from "next-themes";
import { defineChain } from "viem";

export const morphTestNet = /*#__PURE__*/ defineChain({
  id: 2710,
  name: "Morph Testnet",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc-testnet.morphl2.io/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Morph Testnet Explorer",
      url: "https://explorer-testnet.morphl2.io/",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 6040287,
    },
  },
});

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [
      arbitrumSepolia,
      zircuitTestnet,
      baseSepolia,
      morphTestNet,
      scrollSepolia,
      rootstockTestnet,
    ],
    transports: {
      [arbitrumSepolia.id]: http(
        `https://arbitrum-sepolia.blockpi.network/v1/rpc/public`
      ),
      [zircuitTestnet.id]: http("https://zircuit1.p2pify.com"),
      [baseSepolia.id]: http(
        `https://base-sepolia.g.alchemy.com/v2/ALxyjRhKa-wHbPwix-exGkvwT_xUnDlE`
      ),
      [morphTestNet.id]: http(),
      [scrollSepolia.id]: http("https://scroll-sepolia.drpc.org"),
      [rootstockTestnet.id]: http(),
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
