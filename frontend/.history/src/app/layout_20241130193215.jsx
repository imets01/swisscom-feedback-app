import "./globals.css";
import { Inter } from "next/font/google";
import Header from "./components/headerComponent"; // Default import

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Interview Feedback Form",
  description: "Submit your feedback about the interview process",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
