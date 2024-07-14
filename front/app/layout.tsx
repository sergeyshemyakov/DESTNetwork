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
          TextFont.variable,
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
              <footer className="bg-gray-800 text-white py-4">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                  <div className="text-center md:text-left">
                    <h1 className="text-xl font-bold">Dest Network</h1>
                    <p className="text-sm">
                      Secure Resources. Build Community Aid.
                    </p>
                  </div>
                  <div className="flex space-x-4 mt-4 md:mt-0">
                    <a href="/about" className="text-sm hover:text-gray-400">
                      About
                    </a>
                    <a href="/contact" className="text-sm hover:text-gray-400">
                      Contact
                    </a>
                    <a
                      href="/privacy-policy"
                      className="text-sm hover:text-gray-400"
                    >
                      Privacy Policy
                    </a>
                    <a
                      href="/terms-of-service"
                      className="text-sm hover:text-gray-400"
                    >
                      Terms of Service
                    </a>
                  </div>
                  <div className="flex space-x-4 mt-4 md:mt-0">
                    <a
                      href="https://twitter.com"
                      aria-label="Twitter"
                      className="text-gray-400 hover:text-white"
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="text-xl"
                      >
                        <path d="M24 4.557a9.94 9.94 0 0 1-2.828.775 4.93 4.93 0 0 0 2.165-2.724 9.86 9.86 0 0 1-3.127 1.195 4.918 4.918 0 0 0-8.384 4.482A13.95 13.95 0 0 1 1.671 3.149a4.91 4.91 0 0 0 1.523 6.557 4.904 4.904 0 0 1-2.228-.616v.061a4.921 4.921 0 0 0 3.946 4.827 4.935 4.935 0 0 1-2.224.085 4.923 4.923 0 0 0 4.6 3.417A9.873 9.873 0 0 1 .96 19.54a13.918 13.918 0 0 0 7.548 2.213c9.058 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.637A10.025 10.025 0 0 0 24 4.557z" />
                      </svg>
                    </a>
                    <a
                      href="https://facebook.com"
                      aria-label="Facebook"
                      className="text-gray-400 hover:text-white"
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="text-xl"
                      >
                        <path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.351C0 23.41.59 24 1.325 24H12.82v-9.294H9.692V10.59h3.128V8.28c0-3.1 1.894-4.788 4.662-4.788 1.325 0 2.463.099 2.796.143v3.24h-1.917c-1.505 0-1.795.717-1.795 1.768v2.318h3.587l-.467 3.116h-3.12V24h6.116c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z" />
                      </svg>
                    </a>
                    <a
                      href="https://linkedin.com"
                      aria-label="LinkedIn"
                      className="text-gray-400 hover:text-white"
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="text-xl"
                      >
                        <path d="M20.452 20.452h-3.585v-5.569c0-1.327-.025-3.034-1.849-3.034-1.849 0-2.132 1.447-2.132 2.94v5.663H9.301V9.333h3.44v1.522h.05c.48-.905 1.654-1.857 3.405-1.857 3.641 0 4.314 2.396 4.314 5.509v6.945zM5.337 7.617c-1.149 0-2.083-.935-2.083-2.084 0-1.148.935-2.083 2.083-2.083 1.149 0 2.083.935 2.083 2.083 0 1.149-.935 2.084-2.083 2.084zM6.894 20.452H3.781V9.333h3.113v11.119zM22.225 0H1.771C.791 0 0 .791 0 1.771v20.454C0 23.209.791 24 1.771 24h20.454C23.209 24 24 23.209 24 22.225V1.771C24 .791 23.209 0 22.225 0z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </footer>
            </div>
          </Web3Providers>
        </Providers>
      </body>
    </html>
  );
}
