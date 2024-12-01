import "./globals.css";
import { Inter } from "next/font/google";
import Header from "./components/headerComponent";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Interview Feedback Form",
  description: "Submit your feedback about the interview process",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Header />
      <body className={inter.className}>
        <div>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
