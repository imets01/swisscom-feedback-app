"use client";

import { useSession } from "next-auth/react";
import AdminDashboard from "../components/adminDashboard";

const AdminPage = () => {
  const { data: session, status } = useSession(); // Fetch session client-side

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Unauthorized. Please log in.</div>;
  }

  return <AdminDashboard />;
};

export default AdminPage;
