import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosUrl from "../../Utils/axios";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

interface DoctorDetails {
  _id: string;
  doctorId: string;
  name: string;
  phone: string;
  email: string;
  isBlocked: boolean;
  docStatus: string;
  rejectedReason?: string;
}

function DoctorManagement() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<DoctorDetails[]>([]);

  const fetchDoctors = async () => {
    try {
      const response = await axiosUrl.get("/api/admin/getDoctors");
      setDoctors(response.data.response);
    } catch (error: any) {
      toast.error(`Failed to fetch doctors${error}`);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const toggleListState = async (id: string) => {
    const response = await axiosUrl.put(`/api/admin/listUnlistDoctor/${id}`);
    if (response) {
      toast.success("The Action was successful");
    } else {
      toast.error("The Action was unsuccessful");
    }
    setDoctors((prevDoctors) =>
      prevDoctors.map((doctor) =>
        doctor._id === id ? { ...doctor, isBlocked: !doctor.isBlocked } : doctor
      )
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Doctors List</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Doctors</CardTitle>
            <CardDescription>
              Manage your doctors and their statuses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-4">Name</TableHead>
                  <TableHead className="p-4">Email</TableHead>
                  <TableHead className="p-4">Status</TableHead>
                  <TableHead className="p-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow key={doctor._id}>
                    <TableCell className="p-4 font-medium">
                      Dr. {doctor.name}
                    </TableCell>
                    <TableCell className="p-4">{doctor.email}</TableCell>
                    <TableCell className="p-4">
                      <Badge
                        className="h-8"
                        variant={doctor.isBlocked ? "danger" : "success"}
                      >
                        {doctor.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => toggleListState(doctor._id)}
                          >
                            {doctor.isBlocked ? "List" : "Unlist"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/api/admin/viewDoctor/${doctor._id}`)
                            }
                          >
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

export default DoctorManagement;
