import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "LocalWork — Find Trusted Local Professionals",
    template: "%s | LocalWork",
  },
  description:
    "Connect with verified local service professionals. Find plumbers, electricians, cleaners, and more trusted experts in your area.",
  keywords: [
    "local services",
    "professionals",
    "plumber",
    "electrician",
    "home services",
    "marketplace",
  ],
  openGraph: {
    type: "website",
    siteName: "LocalWork",
    title: "LocalWork — Find Trusted Local Professionals",
    description:
      "Connect with verified local service professionals in your area.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
