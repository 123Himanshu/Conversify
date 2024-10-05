import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ReduxProvider } from "@/redux/provider";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Conversify",
  description:
    "Conversify is a feature-rich chat application designed for seamless communication experiences. With real-time messaging, group conversations, customizable themes, and Google authentication, Conversify offers a dynamic platform for enhanced connectivity and personal growth. Join the conversation today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  axios.defaults.withCredentials = true;
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>{children}</ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
