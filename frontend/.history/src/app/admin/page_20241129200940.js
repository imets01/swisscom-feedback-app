import AdminDashboard from "../components/adminDashboard";

import { getServerSession } from "next-auth/react";

import { signOut } from "next-auth/react";

export default async function AdminPage() {
  const session = await getServerSession(); // Check session on the server
  console.log(session);

  if (!session) {
    return <div>Unauthorized. Please log in.</div>;
  }

  return <AdminDashboard />;
}
