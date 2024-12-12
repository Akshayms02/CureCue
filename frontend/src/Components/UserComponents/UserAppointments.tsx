import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { cancelAppointment, getAllAppointments } from "../../services/userServices";

interface Appointment {
    _id: string;
    patientName: string;
    appointmentTime: string;
    doctorName: string;
    status: string;
    date: any;
    start: string;
    end: string;
    doctor: any;
}

export default function UserAppointmentsList() {
    const userData = useSelector((state: RootState) => state.user.userInfo);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [status, setStatus] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const navigate = useNavigate();

    const fetchAppointments = (status: string, page: number, limit: number) => {
        if (userData?.userId) {
            const userId = userData?.userId
            getAllAppointments(userId, status, page, limit)
                .then((response) => {
                    setAppointments(response?.data.data);
                    setTotalPages(response?.data.totalPages); // Assuming the backend returns totalPages
                })
                .catch((error) => {
                    console.error("Error fetching appointments:", error);
                });
        }
    };

    useEffect(() => {
        fetchAppointments(status, currentPage, 3);
    }, [status, currentPage]);

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        setCurrentPage(1); // Reset to the first page when status changes
    };

    const handleCancelAppointment = (appointmentId: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to cancel this appointment?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, cancel it!",
        }).then((result) => {
            if (result.isConfirmed) {
                cancelAppointment(appointmentId)
                    .then(() => {
                        toast.success("Appointment cancelled");
                        Swal.fire(
                            "Cancelled!",
                            "The appointment has been cancelled. Your money will be refunded to your bank account.",
                            "success"
                        );
                        fetchAppointments(status, currentPage, 3);
                    })
                    .catch((error) => {
                        console.error("Error canceling appointment:", error);
                        Swal.fire("Failed!", "Failed to cancel the appointment. Please try again.", "error");
                    });
            }
        });
    };

    const handleViewAppointment = (appointment: any) => {
        navigate("/viewAppointment", { state: { appointmentId: appointment._id } });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <Badge variant="warning">Pending</Badge>;
            case "completed":
                return <Badge variant="success">Completed</Badge>;
            case "cancelled":
                return <Badge variant="destructive">Cancelled</Badge>;
            case "cancelled by Doctor":
                return <Badge variant="destructive">Cancelled by doctor</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-10 pb-5">
            <Card>
                <CardHeader>
                    <CardTitle>Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-end items-center space-x-2 mb-4">
                        {["All", "pending", "completed", "cancelled", "cancelled by Doctor"].map((statusOption) => (
                            <Button
                                key={statusOption}
                                variant={status === statusOption ? "default" : "outline"}
                                onClick={() => handleStatusChange(statusOption)}
                            >
                                {statusOption}
                            </Button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {appointments.map((appointment) => (
                            <Card key={appointment._id}>
                                <CardContent className="flex justify-between items-start p-6">
                                    <div>

                                        <h3 className="text-lg font-semibold">Patient: {appointment.patientName}</h3>
                                        <p className="text-sm text-muted-foreground">

                                            Appointment: {moment(appointment.date).format('MMMM Do YYYY')}
                                            <br /> from {
                                                moment(appointment.start).format("h:mm A")
                                            } to {
                                                moment(appointment.end).format("h:mm A")
                                            }
                                        </p>
                                        <p className="text-sm text-muted-foreground">Doctor: Dr. {appointment.doctor.name}</p>
                                        {getStatusBadge(appointment.status)}
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" onClick={() => handleViewAppointment(appointment)}>
                                            View Details
                                        </Button>
                                        {appointment.status !== "cancelled" && appointment.status !== "cancelled by Doctor" && appointment.status !== "completed" && appointment.status != "prescription pending" && (
                                            <Button variant="destructive" onClick={() => handleCancelAppointment(appointment._id)}>
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <div>
                            <span>Page {currentPage} of {totalPages}</span>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
