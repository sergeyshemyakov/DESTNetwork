import "@/styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { TextFont, TitleFont } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { ReactNode } from "react";
import { Web3Providers } from "@/components/web3providers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-text antialiased",
          TextFont.className,
          TitleFont.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <Web3Providers>
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                {children}
              </main>
              <footer className="w-full flex items-center justify-center py-3">
                <h4 className="header-text">Decentralized Stashing Network</h4>
              </footer>
            </div>
          </Web3Providers>
        </Providers>
      </body>
    </html>
  );
}
