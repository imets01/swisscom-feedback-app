import AdminDashboard from "../components/adminDashboard";

import { getSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export default async function AdminPage() {
  const session = await getSession(); // Check session on the server
  console.log(session);

  if (!session) {
    return <div>Unauthorized. Please log in.</div>;
  }

  return <AdminDashboard />;
}
