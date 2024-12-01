﻿import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "../components/adminComponents/adminSidebar";

import { getServerSession } from "next-auth";

import AdminDashboard from "../components/adminDashboard";
import HeaderBar from "../components/headerComponent";

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
      <HeaderBar />
      <SidebarProvider>
        <AdminSidebar />
        <main>
          <SidebarTrigger className="p-5" />
          <div>
            <AdminDashboard />
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
