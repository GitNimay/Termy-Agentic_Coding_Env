import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-sans" });

const mono = localFont({
  src: [
    { path: "./fonts/PaperMono-Regular.woff2", weight: "400" },
    { path: "./fonts/PaperMono-Medium.woff2", weight: "500" },
  ],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Termy — a terminal workspace for Windows",
  description:
    "Open-source terminal workspace for Windows, engineered in Rust. Project workspaces, split panes, and sessions that survive closing the window.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
