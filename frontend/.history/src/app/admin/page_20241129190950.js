"use client";

import AdminDashboard from "../components/adminDashboard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

import { signOut } from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return { props: { session } };
}

const AdminPage = () => {
  const { data: session, status } = useSession();
  //   const [isAuthenticated, setIsAuthenticated] = useState(false);
  //   const router = useRouter();

  //   useEffect(() => {
  //     // Check if there's an auth token in localStorage
  //     const token = localStorage.getItem("authToken");
  //     console.log(token);

  //     if (token) {
  //       // Validate the token with the backend (if needed)
  //       setIsAuthenticated(true);
  //     } else {
  //       // If no token, redirect to login page
  //       router.push("/login");
  //     }
  //   }, [router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Unauthorized. Please log in.</div>;
  }

  return <AdminDashboard />;

  //   return isAuthenticated ? (
  //     <div>
  //       <AdminDashboard />
  //     </div>
  //   ) : (
  //     <div>Loading...</div>
  //   );
};

export default AdminPage;
