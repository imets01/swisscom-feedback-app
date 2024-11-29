import AdminDashboard from "../components/adminDashboard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if there's an auth token in localStorage
    const token = localStorage.getItem("authToken");

    if (token) {
      // Validate the token with the backend (if needed)
      setIsAuthenticated(true);
    } else {
      // If no token, redirect to login page
      router.push("/login");
    }
  }, [router]);

  return isAuthenticated ? (
    <div>
      <h1>Admin Page</h1>
      <AdminDashboard />
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default AdminPage;
