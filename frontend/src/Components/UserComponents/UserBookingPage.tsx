import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import { toast } from "sonner";
import { getDepartments } from "../../services/userServices";


interface Department {
  _id: string;
  name: string;
  description: string;
}

const UserBookingPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartments();
        console.log(response);
        setDepartments(response);
        setLoading(false);
      } catch (err: unknown) {
        setError("Failed to load departments");
        setLoading(false);

        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    };

    fetchDepartments();
  }, []);

  if (loading) {
    return <p className="text-center my-auto mx-auto">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 my-auto mx-auto">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-center mb-16 mt-20">Choose the Department</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {departments.map((dept) => (
          <Link
            to={`/${dept._id}`}
            key={dept._id}
            className="bg-white shadow-lg rounded-lg p-8 text-center hover:shadow-2xl transition-shadow cursor-pointer"
          >
            <div className="text-6xl mb-6">💉</div>
            <h2 className="text-2xl font-bold mb-2">{dept.name}</h2>
            <p className="text-gray-600">{dept.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserBookingPage;
