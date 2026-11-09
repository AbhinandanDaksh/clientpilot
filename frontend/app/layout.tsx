import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "aos/dist/aos.css";
import "./globals.css";
import NetworkStatus from "@/components/layout/network-status";
const outfit = Outfit({
  variable: "--font-outfit",
  display: "swap",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "ClientPilot",
  icons: {
    icon: [
      { url: "/branding/clientpilot-icon.svg", type: "image/svg+xml" },
      { url: "/branding/clientpilot-icon_512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/branding/clientpilot-icon_512.png",
  },
  description: "Your projects, clients, and AI agents in one workspace.",
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><NetworkStatus>{children}</NetworkStatus></body>
    </html>
  );
}
