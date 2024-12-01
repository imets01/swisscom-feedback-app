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
        {/* Wrap the content in a flex container to ensure no scroll */}
        <div className="min-h-screen flex flex-col">
          {/* Header goes here */}
          <Header />
          {/* Main content area */}
          <main className="flex-grow overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
