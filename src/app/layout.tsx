import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeAuthProvider } from "@/components/providers/theme-auth-provider";
import Logo from "./public/panchayat_ logo.ico"

const inter = Poppins({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Panchayat",
  description: "Chat and Chill!",
  icons: [{ rel: 'icon', url: Logo.src, type: "image/x-icon" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
       <head>
          <link
              rel="manifest"
              href="/manifest.json"
          />
      </head>
      <body className={inter.className}>
        <ThemeAuthProvider>{children}</ThemeAuthProvider>
      </body>
    </html>
  );
}
