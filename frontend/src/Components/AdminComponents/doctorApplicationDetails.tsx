import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import Swal from "sweetalert2";
import { acceptDoctorApplication, rejectDoctor } from "../../services/adminServices";

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const DoctorApplicationDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  console.log(state.response);
  const doctor = state?.response.response;
  const files = state?.response?.signedFiles;

  const handleAccept = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to accept this doctor's application.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accept it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await acceptDoctorApplication(doctor.doctorId)
          Swal.fire(
            "Accepted!",
            "Doctor's application has been accepted.",
            "success"
          );
          navigate("/admin/doctors");
        } catch (error) {
          console.error("Failed to accept application", error);
          Swal.fire("Error", "Failed to accept application", "error");
        }
      }
    });
  };

  const handleReject = async () => {
    try {
      await rejectDoctor(doctor.doctorId)
      toast.success("Doctor application rejected");
      navigate("/admin/doctors");
    } catch (error) {
      console.error("Failed to reject application", error);
      toast.error("Failed to reject application");
    }
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };


  const openModal = (fileUrl: string) => {
    setSelectedFile(fileUrl);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 ">
      {/* Doctor Basic Information */}
      <div className="flex items-center gap-6">
        <img
          src={files[0]?.signedUrl}
          alt="Doctor Profile"
          className="w-28 h-28 object-cover rounded-full"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {doctor.name}
          </h2>
          <p className="text-gray-600">Gender: {doctor.gender}</p>
          <p className="text-gray-600">DOB: {formatDate(doctor.DOB)}</p>
          <p className="text-gray-600">Fees: ₹{doctor.fees}</p>
        </div>
      </div>

      {/* Department Details */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-700">Department</h3>
        <p className="text-gray-600">{doctor.department.name}</p>
        <p className="text-gray-500 text-sm">{doctor.department.description}</p>
      </div>

      {/* KYC Details */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-700">KYC Details</h3>
        <p className="text-gray-600">
          Aadhar Number: {doctor.kycDetails.adharNumber}
        </p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* KYC Images */}
          <div>
            <h4 className="text-md font-medium text-gray-700">
              Certficate Image
            </h4>
            <img
              src={files[1]?.signedUrl} // Certificate Image
              alt="Certificate"
              className="w-full h-40 object-cover rounded-lg"
            />
            <button
              className="text-blue-600"
              onClick={() => openModal(files[1]?.signedUrl)}
            >
              View
            </button>
          </div>
          <div>
            <h4 className="text-md font-medium text-gray-700">
              Qualification Image
            </h4>
            <img
              src={files[2]?.signedUrl}
              alt="Qualification"
              className="w-full h-40 object-cover rounded-lg"
            />
            <button
              className="text-blue-600"
              onClick={() => openModal(files[2]?.signedUrl)}
            >
              View
            </button>
          </div>
          <div>
            <h4 className="text-md font-medium text-gray-700">
              Aadhar Front Image
            </h4>
            <img
              src={files[3]?.signedUrl}
              alt="Aadhar Front Image"
              className="w-full h-40 object-cover rounded-lg"
            />
            <button
              className="text-blue-600"
              onClick={() => openModal(files[3]?.signedUrl)}
            >
              View
            </button>
          </div>
          <div>
            <h4 className="text-md font-medium text-gray-700">
              Aadhar Back Image
            </h4>
            <img
              src={files[4]?.signedUrl}
              alt="Aadhar BacK Image"
              className="w-full h-40 object-cover rounded-lg"
            />
            <button
              className="text-blue-600"
              onClick={() => openModal(files[4]?.signedUrl)}
            >
              View
            </button>
          </div>
        </div>
      </div>

      {/* Creation Date */}
      <div className="mt-6">
        <p className="text-gray-500 text-sm">
          Account Created: {formatDate(doctor.createdAt)}
        </p>
      </div>

      {/* Accept and Reject Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleReject}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Reject
        </button>
        <button
          onClick={handleAccept}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Accept
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-5xl h-screen">
            <h2 className="text-lg font-bold mb-4">Document Preview</h2>
            <iframe
              className="w-full h-5/6 rounded-lg"
              src={selectedFile ?? ""}
              width="200"
              height="150"
              title="Document Preview"
              frameBorder="0"
            >
              Your browser does not support iframes.
            </iframe>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorApplicationDetails;
