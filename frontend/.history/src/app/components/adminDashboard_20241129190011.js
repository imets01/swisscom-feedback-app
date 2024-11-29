"use client";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <button onClick={() => signOut()}>Log Out</button>
    </div>
  );
}
