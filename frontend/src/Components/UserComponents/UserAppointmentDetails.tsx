import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import axiosUrl from "../../Utils/axios";
import { toast } from "sonner";
import { jsPDF } from 'jspdf';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import Swal from "sweetalert2";


interface ReviewFormValues {
    rating: number | null;
    reviewText: string;
}

interface Appointment {
    _id: string;
    patientName: string;
    age: number;
    date: string;
    start: string;
    end: string;
    description: string;
    status: string;
    reason?: string;
    review?: {
        rating: number;
        reviewText?: string;
    };
    prescription: string;
    fees: string;
    paymentMethod: string;
    amount: number;
    paymentStatus: string;
    paymentId: string;
}

export default function UserAppointmentDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const appointmentId = location.state?.appointmentId;
    const [appointment, setAppointment] = useState<Appointment | null>(null);

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    useEffect(() => {
        const fetchAppointmentDetails = async () => {
            try {
                const response = await axiosUrl.get(`/api/user/getAppointment/${appointmentId}`);
                setAppointment(response.data.data);
            } catch (error) {
                console.error("Error fetching appointment details:", error);
            }
        };

        fetchAppointmentDetails();
    }, [appointmentId]);

    const validationSchema = Yup.object().shape({
        rating: Yup.number().required("Rating is required").min(1, "Rating must be at least 1").max(5, "Rating cannot be more than 5"),
        reviewText: Yup.string().required("Review is required"),
    });

    const handleSubmitReview = async (values: ReviewFormValues, { resetForm }: { resetForm: () => void }) => {
        try {
            const response = await axiosUrl.post('/api/user/addReview', {
                appointmentId: appointment?._id,
                rating: values.rating,
                reviewText: values.reviewText,
            });
            setAppointment(response.data.data);
            toast.success("Your Review Added Successfully");
            resetForm();
            setIsReviewModalOpen(false);
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    const downloadPrescription = async () => {
        console.log(appointment)
        try {
            if (appointment?.prescription) {
                const doc = new jsPDF();
                doc.setFont("Helvetica", "normal");
                doc.setFontSize(12);

                const darkBlue = "rgb(0, 51, 102)";
                const lightBlue = "rgb(0, 102, 204)";
                const darkGrey = "rgb(50, 50, 50)";
                const lightGrey = "rgb(150, 150, 150)";

                doc.setFontSize(18);
                doc.setTextColor(darkBlue);
                doc.text("CureCue", 10, 15);

                doc.setFontSize(22);
                doc.setTextColor(lightBlue);
                doc.text("Prescription", 10, 30);

                doc.setDrawColor(0, 102, 204);
                doc.setLineWidth(1);
                doc.line(10, 35, 200, 35);

                doc.setFontSize(14);
                doc.setTextColor(darkGrey);
                doc.text(`Patient Name: ${appointment.patientName}`, 10, 45);

                doc.text(`Date: ${moment(appointment.date).format("MMMM Do YYYY")}`, 10, 65);
                doc.text(`Time: ${moment(appointment.start).format('h:mm A')} - ${moment(appointment.end).format('h:mm A')}`, 10, 75);
                doc.setLineWidth(0.5);
                doc.line(10, 80, 200, 80);

                doc.setFontSize(16);
                doc.setTextColor(darkBlue);
                doc.text("Prescription Details:", 10, 90);

                const prescriptionSpacing = 10;
                let yPosition = 90 + prescriptionSpacing;

                const prescriptionLines = appointment.prescription.split('\n');
                prescriptionLines.forEach((line) => {
                    doc.setTextColor(darkGrey);
                    doc.text(line, 10, yPosition);
                    yPosition += 8;
                });

                doc.setFontSize(15);
                doc.setTextColor(lightGrey);
                doc.text("Thank you for choosing our service!", 10, 280);
                doc.text("For any questions, please contact us.", 10, 285);
                doc.text("CureCue | curecue@gmail.com", 10, 290);

                doc.save(`Prescription_${appointment.patientName}.pdf`);
            } else {
                console.error("no prescription")
            }
        } catch (error) {
            console.log(error)
        }

    };

    const navigateChat = () => {
        navigate("/chat", { state: { appointment: appointment } });
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
                axiosUrl
                    .put(`/api/user/cancelAppointment/${appointmentId}`)
                    .then(() => {
                        toast.success("Appointment cancelled");
                        Swal.fire(
                            "Cancelled!",
                            "The appointment has been cancelled. Your money will be refunded to your bank account.",
                            "success"
                        );

                        navigate("/appointments")

                    })
                    .catch((error) => {
                        console.error("Error canceling appointment:", error);
                        Swal.fire("Failed!", "Failed to cancel the appointment. Please try again.", "error");
                    });
            }
        });
    };

    return (
        <Card className="w-full max-w-4xl mx-auto mt-10">
            <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <CardDescription>Patient Name</CardDescription>
                        <p className="font-medium">{appointment?.patientName}</p>
                    </div>
                    <div>
                        <CardDescription>Age</CardDescription>
                        <p className="font-medium">{appointment?.age || "N/A"}</p>
                    </div>
                    <div>
                        <CardDescription>Date</CardDescription>
                        <p className="font-medium">{moment(appointment?.date).format("MMMM Do YYYY")}</p>
                    </div>
                    <div>
                        <CardDescription>Time</CardDescription>
                        <p className="font-medium">{moment(appointment?.start).format('h:mm A')} -  {moment(appointment?.end).format('h:mm A')}</p>
                    </div>
                </div>



                <div className="payment-details-container bg-gray-50 p-6 rounded-2xl shadow-md">
                    <CardDescription className="text-xl font-bold text-primary">Payment Details</CardDescription>

                    <div className="payment-info w-full rounded-md border p-4 bg-white">
                        <div className="payment-method flex justify-between items-center mb-4">
                            <span className="font-medium text-gray-600">Payment Method:</span>
                            <span className="text-lg font-bold">{appointment?.paymentMethod || "N/A"}</span>
                        </div>
                        <div className="payment-amount flex justify-between items-center mb-4">
                            <span className="font-medium text-gray-600">Amount:</span>
                            <span className="text-lg font-bold">{appointment?.fees || "N/A"}</span>
                        </div>
                        <div className="payment-status flex justify-between items-center mb-4">
                            <span className="font-medium text-gray-600">Payment Status:</span>
                            <span className={`text-lg font-bold ${appointment?.paymentStatus === "payment completed" ? "text-green-600" : "text-red-600"}`}>{appointment?.paymentStatus || "N/A"}</span>
                        </div>
                        <div className="payment-id flex justify-between items-center">
                            <span className="font-medium text-gray-600">Payment ID:</span>
                            <span className="text-lg font-bold">{appointment?.paymentId || "N/A"}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    {appointment?.status === "completed" && (
                        <>
                            {appointment?.review?.rating === 0 ? (
                                <Button onClick={() => setIsReviewModalOpen(true)}>Add Review</Button>
                            ) : (
                                <Badge variant="secondary">Review Added: {appointment?.review?.rating} ⭐</Badge>
                            )}
                            <Button onClick={downloadPrescription}>Download Prescription</Button>
                        </>
                    )}

                    {appointment?.status === "cancelled" && (
                        <Badge variant="destructive">Cancelled</Badge>
                    )}

                    {appointment?.status === "cancelled by Doctor" && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="destructive">Cancelled by Doctor</Button>

                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Cancellation Reason</DialogTitle>
                                </DialogHeader>
                                <p>{appointment?.reason || "No reason provided."}</p>
                            </DialogContent>
                        </Dialog>
                    )}

                    {appointment?.status === "prescription pending" && (
                        <Badge variant="secondary">Prescription will be added soon...</Badge>
                    )}

                    {appointment?.status === "pending" && (
                        <>
                            <Button onClick={navigateChat}>Chat</Button>
                            <Button variant="destructive" onClick={() => handleCancelAppointment(appointment._id)}>Cancel</Button>
                        </>
                    )}
                </div>
            </CardContent>

            <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit Your Review</DialogTitle>
                    </DialogHeader>
                    <Formik
                        initialValues={{ rating: null, reviewText: "" }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmitReview}
                    >
                        {({ setFieldValue }) => (
                            <Form className="space-y-4">
                                <div>
                                    <Label htmlFor="rating">Rating</Label>
                                    <Field name="rating">
                                        {({ field }: FieldProps) => (
                                            <div className="flex items-center space-x-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setFieldValue("rating", star)}
                                                        className={`text-2xl ${field.value >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    >
                                                        ★
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </Field>
                                    <ErrorMessage name="rating" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div>
                                    <Label htmlFor="reviewText">Review</Label>
                                    <Field
                                        as={Textarea}
                                        id="reviewText"
                                        name="reviewText"
                                        placeholder="Write your review here..."
                                    />
                                    <ErrorMessage name="reviewText" component="div" className="text-red-500 text-sm" />
                                </div>
                                <Button type="submit">Submit Review</Button>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </Card>
    );
}