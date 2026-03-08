import type { Metadata } from "next";
import "./globals.css";
import "./calendar.css";
import "react-day-picker/dist/style.css";
import "../styles/calendar.css";

import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FixStay",
  description: "Find your perfect stay in Alibag",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-neutral-950 text-white`}>

        <Navbar />

        {children}

      </body>
    </html>
  );
}
