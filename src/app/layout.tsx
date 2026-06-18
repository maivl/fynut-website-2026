import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "fynut — 本地优先，隐私至上",
  description:
    "Local-first, privacy-first. 所有加密计算在你的浏览器本地完成，密钥由你完全掌控，数据永不离开你的设备。",
  keywords: [
    "fynut",
    "local-first",
    "zero-trust",
    "AES-256-GCM",
    "WebRTC",
    "WebAssembly",
    "privacy",
    "encryption",
  ],
  authors: [{ name: "fynut" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "fynut — 本地优先，隐私至上",
    description:
      "Local-first · Zero-Trust. 当隐私成为奢侈品，我们选择让它回归本质。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cormorant.variable} antialiased bg-[var(--bg-primary)] text-[var(--text-primary)]`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
