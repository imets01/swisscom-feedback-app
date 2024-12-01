import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "../components/adminComponents/adminSidebar";
import Header from "../components/headerComponent";

import { getServerSession } from "next-auth";

export default async function Layout({ children }) {
  const session = await getServerSession(); // Check session on the server
  console.log(session);

  if (!session) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">
          Oops! Looks like you don&apos;t have access
        </h1>
      </div>
    );
  }
  return (
    <div>
      <SidebarProvider>
        <AdminSidebar />
        <main>
          <SidebarTrigger className="p-5" />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
