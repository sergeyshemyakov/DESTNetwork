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
              <footer className="py-4 mt-8">
                <div className="container mx-auto max-w-7xl pt-16 px-6 flex flex-col md:flex-row justify-between items-center">
                  <div className="text-center md:text-left">
                    <h1 className="text-xl header-text">Dest Network</h1>
                    <p className="text-sm">
                      Secure Resources. Build Community Aid.
                    </p>
                  </div>
                  {/* <div className="flex space-x-4 mt-4 md:mt-0">
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
                  </div> */}
                  <div className="flex space-x-4 mt-4 md:mt-0">
                    <a
                      href="https://www.linkedin.com/in/sergey-shemyakov/"
                      aria-label="LinkedIn"
                      className="text-gray-400 hover:text-white"
                    >
                      <div className="flex">
                        <svg
                          width="24"
                          height="24"
                          fill="currentColor"
                          className="text-xl"
                        >
                          <path d="M20.452 20.452h-3.585v-5.569c0-1.327-.025-3.034-1.849-3.034-1.849 0-2.132 1.447-2.132 2.94v5.663H9.301V9.333h3.44v1.522h.05c.48-.905 1.654-1.857 3.405-1.857 3.641 0 4.314 2.396 4.314 5.509v6.945zM5.337 7.617c-1.149 0-2.083-.935-2.083-2.084 0-1.148.935-2.083 2.083-2.083 1.149 0 2.083.935 2.083 2.083 0 1.149-.935 2.084-2.083 2.084zM6.894 20.452H3.781V9.333h3.113v11.119zM22.225 0H1.771C.791 0 0 .791 0 1.771v20.454C0 23.209.791 24 1.771 24h20.454C23.209 24 24 23.209 24 22.225V1.771C24 .791 23.209 0 22.225 0z" />
                        </svg>
                        <span className="ml-2"> Sergey Shemyakov</span>
                      </div>
                    </a>

                    <a
                      href="https://www.linkedin.com/in/dzmitry-ivanou-b9aa45139/"
                      aria-label="LinkedIn"
                      className="text-gray-400 hover:text-white"
                      target="_blank"
                    >
                      <div className="flex">
                        <svg
                          width="24"
                          height="24"
                          fill="currentColor"
                          className="text-xl"
                        >
                          <path d="M20.452 20.452h-3.585v-5.569c0-1.327-.025-3.034-1.849-3.034-1.849 0-2.132 1.447-2.132 2.94v5.663H9.301V9.333h3.44v1.522h.05c.48-.905 1.654-1.857 3.405-1.857 3.641 0 4.314 2.396 4.314 5.509v6.945zM5.337 7.617c-1.149 0-2.083-.935-2.083-2.084 0-1.148.935-2.083 2.083-2.083 1.149 0 2.083.935 2.083 2.083 0 1.149-.935 2.084-2.083 2.084zM6.894 20.452H3.781V9.333h3.113v11.119zM22.225 0H1.771C.791 0 0 .791 0 1.771v20.454C0 23.209.791 24 1.771 24h20.454C23.209 24 24 23.209 24 22.225V1.771C24 .791 23.209 0 22.225 0z" />
                        </svg>
                        <span className="ml-2"> Dzmitry Ivanou</span>
                      </div>
                    </a>

                    <a
                      href="https://www.linkedin.com/in/kanstantsin-yaromenka-a24357174/"
                      aria-label="LinkedIn"
                      className="text-gray-400 hover:text-white"
                      target="_blank"
                    >
                      <div className="flex">
                        <svg
                          width="24"
                          height="24"
                          fill="currentColor"
                          className="text-xl"
                        >
                          <path d="M20.452 20.452h-3.585v-5.569c0-1.327-.025-3.034-1.849-3.034-1.849 0-2.132 1.447-2.132 2.94v5.663H9.301V9.333h3.44v1.522h.05c.48-.905 1.654-1.857 3.405-1.857 3.641 0 4.314 2.396 4.314 5.509v6.945zM5.337 7.617c-1.149 0-2.083-.935-2.083-2.084 0-1.148.935-2.083 2.083-2.083 1.149 0 2.083.935 2.083 2.083 0 1.149-.935 2.084-2.083 2.084zM6.894 20.452H3.781V9.333h3.113v11.119zM22.225 0H1.771C.791 0 0 .791 0 1.771v20.454C0 23.209.791 24 1.771 24h20.454C23.209 24 24 23.209 24 22.225V1.771C24 .791 23.209 0 22.225 0z" />
                        </svg>
                        <span className="ml-2"> Kanstantsin Yaromenka</span>
                      </div>
                    </a>
                  </div>

                  <div>
                    <p>ETHGlobal. Brussels 2024.</p>
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
