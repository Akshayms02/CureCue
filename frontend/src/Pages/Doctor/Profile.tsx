import React, { useEffect, useState } from "react";
import { defaultImg } from "../../assets/profile";
import { getDoctorData } from "../../services/doctorServices";
import { FaCamera } from "react-icons/fa";

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
  image: any;
  imageUrl: string;
}

const ProfileCard: React.FC = () => {
  const [doctorData, setDoctorData] = useState<DoctorInfo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [editData, setEditData] = useState({
    email: "",
    phone: "",
    fees: 0,
    gender: "",
  });

  useEffect(() => {
    const storedData = localStorage.getItem("doctorInfo");
    const parsedData = JSON.parse(storedData as string);
    const doctorId = parsedData?.doctorId;

    const fetchDoctorData = async (doctorId: string) => {
      const response = await getDoctorData(doctorId as string);
      const doctorInfo = response?.data as DoctorInfo;
      setDoctorData(doctorInfo);

      // Initialize edit data with current doctor details
      setEditData({
        email: doctorInfo.email,
        phone: doctorInfo.phone,
        fees: doctorInfo.fees,
        gender: doctorInfo.gender,
      });
    };

    fetchDoctorData(doctorId);
  }, []);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  // Handle image save functionality
  const handleImageSave = () => {
    console.log("Image uploaded:", newImage);
    setShowModal(false);
  };

  // Toggle Edit Mode
  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  // Handle save functionality
  const handleSave = async () => {
    if (doctorData) {
      const updatedDoctorData = {
        ...doctorData,
        ...editData,
      };
      try {
        console.log("Saving updated doctor data..."); // Replace with API call to update doctor data
        setDoctorData(updatedDoctorData); // Update state with new data
        setIsEditing(false); // Exit edit mode
      } catch (error) {
        console.error("Error updating doctor data:", error);
      }
    }
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setEditData({
      ...editData,
      [field]: e.target.value,
    });
  };

  if (!doctorData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="w-full h-full bg-white p-8 rounded-xl shadow-xl space-y-6">
        {/* Profile header */}
        <div className="flex justify-between items-start mb-6">
          <div className="relative flex items-center space-x-6">
            <img
              src={doctorData?.imageUrl || defaultImg}
              alt={doctorData.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-cyan-400 hover:shadow-lg transition-all"
            />
            {/* Camera Icon for Editing Image */}
            <button
              onClick={() => setShowModal(true)}
              className="absolute bottom-2 left-16 bg-cyan-400 text-white rounded-full p-2 hover:bg-cyan-600 transition-colors shadow-lg "
            >
              <FaCamera />
            </button>
            {/* User name and details */}
            <div>
              <h2 className="text-3xl font-semibold text-gray-800 hover:text-blue-500 transition-colors">
                {doctorData?.name}
              </h2>
              <p className="text-gray-600 mt-1">
                Department:{" "}
                <span className="text-cyan-500">{doctorData.department?.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={isEditing ? handleSave : toggleEditMode}
            className="px-4 py-2 bg-cyan-400 text-white rounded-lg shadow-md hover:bg-cyan-600 transition-colors"
          >
            {isEditing ? "Save" : "Edit Profile"}
          </button>
        </div>

        {/* Experience and About */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Experience */}
          <div className="bg-gray-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Experience</h3>
            <p className="text-gray-600">
              Specialist in{" "}
              <span className="font-medium text-blue-500">{doctorData.department?.description}</span>
            </p>
          </div>
          {/* About Me */}
          <div className="bg-gray-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold mb-2 text-gray-700">About me</h3>
            <p className="text-gray-600">
              Hi, I am Dr.{" "}
              <span className="font-medium text-blue-500">{doctorData?.name}</span>, a specialist in{" "}
              <span className="font-medium text-blue-500">{doctorData?.department?.name}</span> with a focus on{" "}
              <span className="font-medium text-blue-500">{doctorData?.department?.description}</span>.
            </p>
            <p className="mt-4 text-gray-600">
              My contact information is available for inquiries and appointments.
            </p>
          </div>
        </div>

        {/* Editable Contact Info */}
        <div className="bg-gray-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Contact Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Email:</strong>{" "}
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => handleInputChange(e, "email")}
                  className="border p-2 rounded-md w-full"
                />
              ) : (
                <p className="text-gray-600">{doctorData.email}</p>
              )}
            </div>
            <div>
              <strong>Phone:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={editData.phone}
                  onChange={(e) => handleInputChange(e, "phone")}
                  className="border p-2 rounded-md w-full"
                />
              ) : (
                <p className="text-gray-600">{doctorData.phone}</p>
              )}
            </div>
            <div>
              <strong>Fees:</strong>{" "}
              {isEditing ? (
                <input
                  type="number"
                  value={editData.fees}
                  onChange={(e) => handleInputChange(e, "fees")}
                  className="border p-2 rounded-md w-full"
                />
              ) : (
                <p className="text-gray-600">${doctorData.fees}</p>
              )}
            </div>
            <div>
              <strong>Gender:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={editData.gender}
                  onChange={(e) => handleInputChange(e, "gender")}
                  className="border p-2 rounded-md w-full"
                />
              ) : (
                <p className="text-gray-600">{doctorData.gender}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Image Upload */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">Update Profile Picture</h2>
            <input type="file" onChange={handleImageUpload} />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)} // Cancel action
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImageSave} // Save image action
                className="px-4 py-2 bg-cyan-400 text-white rounded-lg shadow-md hover:bg-cyan-600 transition-colors"
              >
                Save Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
