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
      <body className={inter.className}>
        <div className="flex flex-col h-full overflow-hidden">
          <header>
            <HeaderBar />
          </header>
          <div className="flex flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
