import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "../components/adminComponents/adminSidebar";
import Header from "../components/headerComponent";

import { getServerSession } from "next-auth";

import AdminDashboard from "../components/adminDashboard";

export default async function AdminPage() {
  const session = await getServerSession(); // Check session on the server

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
        <div className="flex">
          <AdminSidebar className="" />
          <main className="ml-[16rem] w-full">
            <AdminDashboard />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
