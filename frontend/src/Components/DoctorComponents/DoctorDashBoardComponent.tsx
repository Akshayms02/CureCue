import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { toast } from "sonner";
import axiosUrl from "../../Utils/axios";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

export interface Specializations {
  _id: number;
  name: string;
  description: string;
  isListed: boolean;
}

const validationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.string().min(1, "Select your gender"),
  dob: z.string().min(1, "Date of Birth is required"),
  department: z.string().min(1, "Department is required"),
  fees: z.number().min(0, "Fees must be positive"),
  aadhaarNumber: z
    .string()
    .length(12, "Aadhaar Number must be exactly 12 digits"),
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Image is required"),
  aadhaarFrontImage: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Aadhaar Front Image is required"),
  aadhaarBackImage: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Aadhaar Back Image is required"),
  certificateImage: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Certificate Image is required"),
  qualificationImage: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Qualification Image is required"),
});

export function DoctorDashboard() {
  const DoctorData = useSelector((state: RootState) => state.doctor);
  const [specializations, setSpecializations] = React.useState<
    Specializations[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [imagePreviews, setImagePreviews] = useState<{
    [key: string]: string | null;
  }>({
    image: null,
    aadhaarFrontImage: null,
    aadhaarBackImage: null,
    certificateImage: null,
    qualificationImage: null,
  });
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: "",
      gender: "",
      dob: "",
      department: "",
      fees: "",
      aadhaarNumber: "",
      image: null,
      aadhaarFrontImage: null,
      aadhaarBackImage: null,
      certificateImage: null,
      qualificationImage: null,
    },
  });

  React.useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axiosUrl.get("/api/admin/getSpecializations");
        setSpecializations(response.data.response);
      } catch (error) {
        console.error("Failed to fetch specializations:", error);
      }
    };

    fetchSpecializations();
  }, []);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = event.currentTarget.files
      ? event.currentTarget.files[0]
      : null;
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews((prev) => ({
        ...prev,
        [fieldName]: previewUrl,
      }));
      setValue(fieldName as any, file);
    }
  };

  const onSubmit = async (values: any) => {
    const docData: string | null = localStorage.getItem("doctorInfo");
    if (!docData) {
      throw new Error("Email not found..!Login again");
    }
    const parseData = JSON.parse(docData);

    const email = parseData.email;

    const formData = new FormData();

    formData.append("email", email);
    formData.append("name", values.name);
    formData.append("gender", values.gender);
    formData.append("dob", values.dob);
    formData.append("department", values.department);
    formData.append("fees", values.fees);
    formData.append("aadhaarNumber", values.aadhaarNumber);

    if (values.image) {
      formData.append("image", values.image);
    }
    if (values.aadhaarFrontImage) {
      formData.append("aadhaarFrontImage", values.aadhaarFrontImage);
    }
    if (values.aadhaarBackImage) {
      formData.append("aadhaarBackImage", values.aadhaarBackImage);
    }
    if (values.certificateImage) {
      formData.append("certificateImage", values.certificateImage);
    }
    if (values.qualificationImage) {
      formData.append("qualificationImage", values.qualificationImage);
    }

    try {
      const response = await axiosUrl.post(
        "/doctor/uploadDoctorData",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Form submitted successfully", response.data);
      navigate("/doctor/verificationProcessing");
    } catch (error: any) {
      console.error("Failed to submit the form", error);
      if (error.message === "Email not found..!Login again") {
        toast.error("Email not found..!Login again");
      }
    }
  };

  return (
    <div className="flex flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        {DoctorData.docStatus === "pending" ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-center text-6xl text-black mt-40">
              KYC Upload Required
            </h1>
            <Button onClick={() => setIsModalOpen(true)} className="mt-8">
              Upload KYC Documents
            </Button>
          </div>
        ) : (
          <h1 className="text-center text-6xl text-black mt-40">
            Welcome to Doctor Dashboard
          </h1>
        )}
      </main>

      {/* KYC Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl h-[80vh] overflow-y-auto relative">
            {" "}
            {/* Adjusted width and height */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4">Upload KYC Documents</h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Name"
                    {...field}
                    className={`border p-2 rounded ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                )}
              />
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`border p-2 rounded ${
                      errors.gender ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                )}
              />
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <Input
                    type="date"
                    {...field}
                    className={`border p-2 rounded ${
                      errors.dob ? "border-red-500" : ""
                    }`}
                  />
                )}
              />
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`border p-2 rounded ${
                      errors.department ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select Department</option>
                    {specializations
                      .filter((specialization) => specialization.isListed)
                      .map((specialization) => (
                        <option
                          key={specialization._id}
                          value={specialization._id}
                        >
                          {specialization.name}
                        </option>
                      ))}
                  </select>
                )}
              />
              <Controller
                name="fees"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="Fees"
                    {...field}
                    className={`border p-2 rounded ${
                      errors.fees ? "border-red-500" : ""
                    }`}
                  />
                )}
              />
              <Controller
                name="aadhaarNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Aadhaar Number"
                    {...field}
                    className={`border p-2 rounded ${
                      errors.aadhaarNumber ? "border-red-500" : ""
                    }`}
                  />
                )}
              />
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      type="file"
                      onChange={(e) => handleImageChange(e, "image")}
                      className="border p-2 rounded"
                    />
                    {imagePreviews.image && (
                      <img src={imagePreviews.image} alt="Image preview" />
                    )}
                  </div>
                )}
              />
              <Controller
                name="aadhaarFrontImage"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      type="file"
                      onChange={(e) =>
                        handleImageChange(e, "aadhaarFrontImage")
                      }
                      className="border p-2 rounded"
                    />
                    {imagePreviews.aadhaarFrontImage && (
                      <img
                        src={imagePreviews.aadhaarFrontImage}
                        alt="Aadhaar Front Image preview"
                      />
                    )}
                  </div>
                )}
              />
              <Controller
                name="aadhaarBackImage"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      type="file"
                      onChange={(e) => handleImageChange(e, "aadhaarBackImage")}
                      className="border p-2 rounded"
                    />
                    {imagePreviews.aadhaarBackImage && (
                      <img
                        src={imagePreviews.aadhaarBackImage}
                        alt="Aadhaar Back Image preview"
                      />
                    )}
                  </div>
                )}
              />
              <Controller
                name="certificateImage"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      type="file"
                      onChange={(e) => handleImageChange(e, "certificateImage")}
                      className="border p-2 rounded"
                    />
                    {imagePreviews.certificateImage && (
                      <img
                        src={imagePreviews.certificateImage}
                        alt="Certificate Image preview"
                      />
                    )}
                  </div>
                )}
              />
              <Controller
                name="qualificationImage"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      type="file"
                      onChange={(e) =>
                        handleImageChange(e, "qualificationImage")
                      }
                      className="border p-2 rounded"
                    />
                    {imagePreviews.qualificationImage && (
                      <img
                        src={imagePreviews.qualificationImage}
                        alt="Qualification Image preview"
                      />
                    )}
                  </div>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
