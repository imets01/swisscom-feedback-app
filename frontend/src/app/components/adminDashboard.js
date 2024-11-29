"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter(); // Initialize the router

  // Function to handle sign-out and redirect
  const handleSignOut = async () => {
    await signOut({ redirect: false }); // Sign out without redirecting immediately
    router.push("/"); // Redirect to the homepage (or wherever you want)
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Button onClick={handleSignOut}>Log Out</Button>
    </div>
  );
}
