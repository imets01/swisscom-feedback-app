﻿import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Interview Feedback Form",
  description: "Submit your feedback about the interview process",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Header />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
