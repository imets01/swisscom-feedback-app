import "./globals.css";
import { Inter } from "next/font/google";
import HeaderBar from "./components/headerComponent";
import { AdminSidebar } from "./components/adminComponents/adminSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Interview Feedback Form",
  description: "Submit your feedback about the interview process",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <HeaderBar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
