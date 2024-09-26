import React, { useEffect, useState } from "react";
import { defaultImg } from "../../assets/profile";

// Define the types for the data
interface Department {
  _id: string;
  name: string;
  description: string;
  isListed: boolean;
  createdAt: string;
  __v: number;
}

interface DoctorInfo {
  name: string;
  email: string;
  doctorId: string;
  phone: string;
  isBlocked: boolean;
  docStatus: string;
  DOB: string;
  fees: number;
  gender: string;
  department: Department;
  image: any
}

const ProfileCard: React.FC = () => {
  const [doctorData, setDoctorData] = useState<DoctorInfo | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("doctorInfo");
    if (storedData) {
      setDoctorData(JSON.parse(storedData) as DoctorInfo);
    }
  }, []);

  if (!doctorData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="w-full h-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        {/* Profile header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            {/* Profile image */}
            <img
              src={doctorData.image || defaultImg}
              alt={doctorData.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
            />
            {/* User name and details */}
            <div>
              <h2 className="text-2xl font-bold">{doctorData?.name}</h2>
              <p className="text-gray-600">
                Department: {doctorData.department?.name}
              </p>
              <span className="text-sm text-green-500 flex items-center">
                
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Experience and About */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Experience */}
          <div>
            <h3 className="text-lg font-bold">Experience</h3>
            <p>Specialist in {doctorData.department?.description}</p>
          </div>
          {/* About Me */}
          <div>
            <h3 className="text-lg font-bold">About me</h3>
            <p>
              Hi, I am Dr. {doctorData?.name}, a specialist in{" "}
              {doctorData?.department?.name} with a focus on{" "}
              {doctorData?.department?.description}.
            </p>
            <p className="mt-2">
              My contact information is available for inquiries and
              appointments.
            </p>
          </div>
        </div>

        {/* Skills and Contact Info */}
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
          {/* Skills */}
          <div>
            <h3 className="text-lg font-bold">Skills</h3>
            <ul className="flex space-x-3">
              <li className="px-3 py-1 bg-gray-100 rounded-lg">
                Nuerology Expertise
              </li>
              <li className="px-3 py-1 bg-gray-100 rounded-lg">Patient Care</li>
              <li className="px-3 py-1 bg-gray-100 rounded-lg">Diagnosis</li>
              <li className="px-3 py-1 bg-gray-100 rounded-lg">
                Treatment Plans
              </li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold">Contact Info</h3>
            <p>Email: {doctorData?.email}</p>
            <p>Phone: {doctorData?.phone}</p>
            <p>Fees: ${doctorData?.fees}</p>
            <p>Gender: {doctorData?.gender}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
