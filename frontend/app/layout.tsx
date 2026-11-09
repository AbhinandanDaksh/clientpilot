import type { Metadata } from "next";
import { siteUrl, siteTitle, siteDescription } from "@/common/site";
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
  metadataBase: siteUrl,
  applicationName: "ClientPilot",
  title: { default: siteTitle, template: "%s | ClientPilot" },
  openGraph: {
    type: "website",
    siteName: "ClientPilot",
    locale: "en_US",
    title: siteTitle,
    description: siteDescription,
    images: [{ url: "/branding/clientpilot-icon_512.png", width: 512, height: 512, alt: "ClientPilot" }],
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
    images: [{ url: "/branding/clientpilot-icon_512.png", alt: "ClientPilot" }],
  },
  icons: {
    icon: [
      { url: "/branding/clientpilot-icon.svg", type: "image/svg+xml" },
      { url: "/branding/clientpilot-icon_512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/branding/clientpilot-icon_512.png",
  },
  description: siteDescription,
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
