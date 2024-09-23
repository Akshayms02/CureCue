import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const adminAccessToken = localStorage.getItem("adminAccessToken");
    if (!adminAccessToken) {
      navigate("/admin/login");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <h1 className="text-center text-6xl text-black mt-40">
          Welcome to Admin DashBoard
        </h1>
      </main>
    </div>
  );
}
