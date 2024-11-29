import AdminDashboard from "../components/adminDashboard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  return (
    <div>
      <AdminDashboard />
    </div>
  );
};

export default AdminPage;
