

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { LuBadgeCheck } from "react-icons/lu";
import { getDepDoctors } from "../../services/userServices";

interface Doctor {
    doctorId: string;
    _id: string;
    name: string;
    department: string;
    profileUrl: string;
}

const DoctorListDepartmentWise = () => {
    const { departmentId } = useParams<{ departmentId: string }>();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await getDepDoctors(departmentId as string)
                console.log(response)
                setDoctors(response);
                setLoading(false);
            } catch (err: any) {
                setError("Failed to load doctors");
                setLoading(false);
                toast.error(err.message);
            }
        };

        fetchDoctors();
    }, [departmentId]);

    if (loading) {
        return <p className="text-center my-auto mx-auto">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 my-auto mx-auto">{error}</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {doctors.length > 0 ? (
                <>
                    <h1 className="text-4xl font-bold text-center mb-16 mt-20">Doctors in Department  {doctors[0]?.department}</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {doctors.map((doctor) => (
                            <div key={doctor.doctorId} className="w-64 h-80 text-white shadow-lg rounded-md relative overflow-hidden cursor-pointer font-sans" onClick={() => navigate(`/doctordetails/${doctor.doctorId}`)}>

                                <div className="absolute top-2 left-2 flex items-center space-x-1">
                                    <LuBadgeCheck className="text-3xl fill-blue-600" size={40} />
                                </div>

                                {/* Doctor Image */}
                                <img
                                    src={doctor.profileUrl}
                                    className="rounded-md object-cover w-full h-full"
                                    alt={doctor.name}
                                />

                                {/* Doctor Details */}
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                                    <p className="font-bold text-3xl pr-36">{doctor.name}</p>
                                    <p className="text-md pr-36">{doctor.department}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center text-blue-900 text-5xl font-semibold mt-36 mx-auto my-auto">
                    No doctors available for this department right now.
                </div>
            )}
        </div>
    );
};

export default DoctorListDepartmentWise;
