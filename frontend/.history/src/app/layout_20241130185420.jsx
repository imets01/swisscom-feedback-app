import "./globals.css";
import { Inter } from "next/font/google";
import Header from "./components/headerComponent"; // Adjust the path if necessary

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Interview Feedback Form",
  description: "Submit your feedback about the interview process",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Render the Header globally */}
        <Header />

        {/* Render the page content */}
        {children}
      </body>
    </html>
  );
}
