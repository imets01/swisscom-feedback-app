import AdminDashboard from "../components/adminDashboard";
import Header from "../components/headerComponent";

export default async function AdminPage() {
  return (
    <div>
      <Header />
      <AdminDashboard />
    </div>
  );
}
