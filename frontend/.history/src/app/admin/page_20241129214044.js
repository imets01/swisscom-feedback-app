﻿import AdminDashboard from "../components/adminDashboard";

import { getServerSession } from "next-auth";
import { Button } from "@/components/ui/button";

import { signIn, signOut } from "next-auth/react";

export default async function AdminPage() {
  const session = await getServerSession(); // Check session on the server
  console.log(session);
  ű;

  if (!session) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">
          Oops! Looks like you don&apos;t have access
        </h1>
        <Button onClick={() => signIn()}>Sign In</Button>
      </div>
    );
  }

  return <AdminDashboard />;
}