import React, { useEffect, useState } from "react";

interface UserInfo {
  name: string;
  email: string;
  userId: string;
  phone: string;
  gender: string;
  DOB: string;
  profileImage: any;
  bio: string;
}

const ProfileOverview: React.FC = () => {
  const [userData, setUserData] = useState<UserInfo | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("userInfo");
    if (storedData) {
      setUserData(JSON.parse(storedData) as UserInfo);
    }
  }, []);

  if (!userData) {
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
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
            />
            {/* User name and details */}
            <div>
              <h2 className="text-2xl font-bold">{userData.name}</h2>
              <span className="text-sm text-green-500 flex items-center">
                <span className="mr-1">&#x2022;</span> Active
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Edit Profile
            </button>
          </div>
        </div>

        {/* About Me */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold">About me</h3>
            <p>{userData?.bio || `Hi, I am ${userData.name}.`}</p>
            <p className="mt-2">
              Feel free to reach out to me for inquiries and connections.
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-bold">Contact Info</h3>
            <p>Email: {userData?.email}</p>
            <p>Phone: {userData?.phone}</p>
            <p>
              Gender:{" "}
              {userData?.gender || (
                <span className="text-red-700">Not Provided</span>
              )}
            </p>
            <p>
              Date of Birth:{" "}
              {userData?.DOB || (
                <span className="text-red-700">Not Provided</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
