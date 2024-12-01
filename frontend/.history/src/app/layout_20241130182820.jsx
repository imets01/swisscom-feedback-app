import "./globals.css";
import { Inter } from "next/font/google";
import { Header } from "./components/headerComponent";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Interview Feedback Form",
  description: "Submit your feedback about the interview process",
};

export default function RootLayout({ children }) {
  return (
    <div>
      <Header />
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </div>
  );
}
