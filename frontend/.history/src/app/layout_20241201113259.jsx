import "./globals.css";
import { Inter } from "next/font/google";
import HeaderBar from "./components/headerComponent";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Interview Feedback Form",
  description: "Submit your feedback about the interview process",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col`}>
        <HeaderBar className="fixed z-10" />
        <main className="flex mt-[4rem] h-full">{children}</main>
      </body>
    </html>
  );
}
