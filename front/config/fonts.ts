import { Poppins, Roboto } from "next/font/google";

export const TextFont = Roboto({
  subsets: ["latin"],
  variable: "--font-text",
  weight: ["400"],
});

export const TitleFont = Poppins({
  subsets: ["latin"],
  variable: "--font-header",
  weight: ["700"],
});
