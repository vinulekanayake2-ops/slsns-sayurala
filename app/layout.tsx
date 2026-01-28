import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import OpeningAnimation from "@/components/OpeningAnimation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "SLNS SAYURALA Quiz",
  description: "Naval Training Quiz Module",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable} bg-navy-900 text-steel-100 antialiased`}>
        <OpeningAnimation>
          {children}
        </OpeningAnimation>
      </body>
    </html>
  );
}
