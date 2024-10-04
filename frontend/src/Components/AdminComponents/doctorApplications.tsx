import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { getApplications, viewApplications } from "../../services/adminServices";


interface DoctorApplication {
  _id: string;
  doctorId: string;
  name: string;
  DOB: Date;
  department: any;
  gender: "Male" | "Female";
  image: string;
  fees: number;
  kycDetails: {
    certificateImage: string;
    qualificationImage: string;
    adharFrontImage: string;
    adharBackImage: string;
    adharNumber: number;
  };
  createdAt: Date;
}

function DoctorApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<DoctorApplication[]>([]);

  const fetchApplications = async () => {
    try {
      const response = await getApplications()
      console.log(response);
      setApplications(response);
    } catch (error: any) {
      toast.error(`Failed to fetch doctors${error}`);
    }
  };

  useEffect(() => {
    const adminAccessToken = localStorage.getItem("adminAccessToken");
    if (!adminAccessToken) {
      navigate("/admin/login");
    }
  }, [navigate]);
  useEffect(() => {
    fetchApplications();
  }, []);

  const viewApplication = async (id: string) => {
    try {
      const response =await viewApplications(id)
      navigate("/admin/viewApplication", {
        state: { response: response },
      });
    } catch (error: any) {
      toast.error(`Failed to fetch the details:${error}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Applications List</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              Manage all the doctor Applications and statuses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-4">Name</TableHead>
                  <TableHead className="p-4">Department</TableHead>
                  <TableHead className="p-4">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application._id}>
                    <TableCell className="p-4 font-medium">
                      Dr. {application.name}
                    </TableCell>
                    <TableCell className="p-4">
                      {application.department.name}
                    </TableCell>

                    <TableCell className="p-4">
                      <button
                        className="bg-blue-600 text-white rounded-lg p-2"
                        onClick={() => viewApplication(application._id)}
                      >
                        View Details
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>{/* Add footer content if needed */}</CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default DoctorApplications;
