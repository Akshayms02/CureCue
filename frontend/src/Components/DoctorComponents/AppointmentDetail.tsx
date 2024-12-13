import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import Swal from "sweetalert2"
import jsPDF from "jspdf"
import moment from "moment"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Textarea } from "../../../components/ui/textarea"
import { ScrollArea } from "../../../components/ui/scroll-area"
import { Download, MessageCircle, X } from 'lucide-react'
import { addPrescription, cancelAppointment, getMedicalRecords } from "../../services/doctorServices"

export default function AppointmentDetails() {

    const location = useLocation()
    console.log("hello")
    const navigate = useNavigate()
    const { appointment } = location.state || {}
    console.log(appointment)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [appointmentStatus, setAppointmentStatus] = useState(appointment?.status)
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false)
    const [medicalRecords, setMedicalRecords] = useState<any>([])

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => {
        setIsModalOpen(false)
        formik.resetForm()
    }

    const openPrescriptionModal = () => setIsPrescriptionModalOpen(true)
    const closePrescriptionModal = () => {
        setIsPrescriptionModalOpen(false)
        prescriptionFormik.resetForm()
    }

    const formik = useFormik({
        initialValues: { cancelReason: "" },
        validationSchema: Yup.object({
            cancelReason: Yup.string().min(5, "Reason must be at least 5 characters").required("Cancellation reason is required"),
        }),
        onSubmit: (values) => {
            Swal.fire({
                title: "Are you sure?",
                text: "Do you really want to cancel this appointment?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, cancel it!",
            }).then((result) => {
                if (result.isConfirmed) {
                    cancelAppointment(appointment?._id as string, values.cancelReason as string)
                        .then(() => {
                            setAppointmentStatus("cancelled by Doctor")
                            Swal.fire("Cancelled!", "Your appointment has been cancelled.", "success")
                            closeModal()
                        })
                        .catch(() => {
                            Swal.fire("Error!", "There was an error cancelling your appointment.", "error")
                        })
                }
            })
        },
    })

    const prescriptionFormik = useFormik({
        initialValues: { prescription: "" },
        validationSchema: Yup.object({
            prescription: Yup.string().min(5, "Prescription must be at least 5 characters").required("Prescription is required"),
        }),
        onSubmit: (values) => {
            Swal.fire({
                title: "Are you sure?",
                text: "Do you want to submit this prescription?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, submit it!",
            }).then((result) => {
                if (result.isConfirmed && appointment?._id) {
                    addPrescription(appointment?._id as string, values.prescription as string)
                        .then(() => {
                            setAppointmentStatus("completed")
                            Swal.fire("Submitted!", "The prescription has been added.", "success")
                            closePrescriptionModal()
                        })
                        .catch(() => {
                            Swal.fire("Error!", "There was an error adding the prescription.", "error")
                        })
                } else if (!appointment?._id) {
                    Swal.fire("Error!", "Appointment data is missing.", "error")
                }
            })
        },
    })

    useEffect(() => {
        const fetchMedicalRecords = async () => {
            try {
                console.log(appointment)
                const response = await getMedicalRecords(appointment?.userId as string)
                console.log(response)
                setMedicalRecords(response?.data.response)
            } catch (error) {
                console.error("Error fetching medical records:", error)
            }
        }

        fetchMedicalRecords()
    }, [appointment?._id])

    const downloadPrescription = (record: any) => {
        if (record) {
            const doc = new jsPDF()

            doc.setFont("Helvetica", "normal")
            doc.setFontSize(12)

            const darkBlue = "rgb(0, 51, 102)"
            const lightBlue = "rgb(0, 102, 204)"
            const darkGrey = "rgb(50, 50, 50)"
            const lightGrey = "rgb(150, 150, 150)"

            doc.setFontSize(18)
            doc.setTextColor(darkBlue)
            doc.text("CureCue", 10, 15)

            doc.setFontSize(22)
            doc.setTextColor(lightBlue)
            doc.text("Prescription", 10, 30)

            doc.setDrawColor(0, 102, 204)
            doc.setLineWidth(1)
            doc.line(10, 35, 200, 35)

            doc.setFontSize(14)
            doc.setTextColor(darkGrey)
            doc.text(`Patient Name: ${record.patientName}`, 10, 45)

            doc.text(`Date: ${moment(record.date).format("MMMM Do YYYY")}`, 10, 65)
            doc.text(`Time: ${moment(record.start).format("h:mm A")} - ${moment(record.end).format("h:mm A")}`, 10, 75)

            doc.setLineWidth(0.5)
            doc.line(10, 80, 200, 80)

            doc.setFontSize(16)
            doc.setTextColor(darkBlue)
            doc.text("Prescription Details:", 10, 90)

            const prescriptionSpacing = 10
            let yPosition = 90 + prescriptionSpacing

            const prescriptionLines = record.prescription.split("\n")
            prescriptionLines.forEach((line: string) => {
                doc.setTextColor(darkGrey)
                doc.text(line, 10, yPosition)
                yPosition += 8
            })

            doc.setFontSize(10)
            doc.setTextColor(lightGrey)
            doc.text("Thank you for choosing CureCue!", 10, 280)
            doc.text("For any questions, please contact us.", 10, 285)
            doc.text("CureCue | curecue@gmail.com", 10, 290)

            doc.save(`Prescription_${record.patientName}.pdf`)
        }
    }

    const renderButtons = () => {
        switch (appointmentStatus) {
            case "pending":
                return (
                    <>
                        <Button onClick={() => navigate("/doctor/chat", { state: { appointment } })}>
                            <MessageCircle className="mr-2 h-4 w-4" /> Chat
                        </Button>
                        <Button variant="destructive" onClick={openModal}>
                            <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                    </>
                )
            case "prescription pending":
                return (
                    <>
                        <Button onClick={() => navigate("/doctor/chat", { state: { appointment } })}>
                            <MessageCircle className="mr-2 h-4 w-4" /> Chat
                        </Button>
                        <Button variant="secondary" onClick={openPrescriptionModal}>
                            Add Prescription
                        </Button>
                    </>
                )
            case "cancelled":
                return <p className="text-red-600 text-lg font-medium">Cancelled By Patient</p>
            case "cancelled by Doctor":
                return <p className="text-red-600 text-lg font-medium">Cancelled By Yourself</p>
            case "cancelled by Dr":
                return (
                    <Button variant="outline" onClick={openModal}>
                        Cancelled by You
                    </Button>
                )
            case "completed":
                return <p className="text-green-600 text-lg font-medium">Completed</p>
            default:
                return null
        }
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Appointment Details</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold">Patient Information</h3>
                            <p>Name: {appointment?.patientName || "N/A"}</p>
                            <p>Date: {appointment?.date ? new Date(appointment.date).toLocaleDateString() : "N/A"}</p>
                            <p>Time: {appointment?.start ? new Date(appointment.start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : "N/A"}</p>
                            <p>Fees: {appointment?.fees || "N/A"}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div style={{ height: '100px' }}>
                        </div>
                        <div className="flex justify-end space-x-4">{renderButtons()}</div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Medical Records</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Patient Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Prescription</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {medicalRecords.map((record: any) => (
                                <TableRow key={record._id}>
                                    <TableCell>{record.patientName}</TableCell>
                                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        {record.prescription ? (
                                            <Button variant="outline" size="sm" onClick={() => downloadPrescription(record)}>
                                                <Download className="mr-2 h-4 w-4" /> Download
                                            </Button>
                                        ) : (
                                            <span className="text-gray-500 text-sm">No Prescription</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{appointmentStatus === "cancelled by Doctor" ? "Cancellation Reason" : "Cancel Appointment"}</DialogTitle>
                    </DialogHeader>
                    {appointmentStatus === "cancelled by Doctor" ? (
                        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                            <p>{appointment?.reason}</p>
                        </ScrollArea>
                    ) : (
                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            <Textarea
                                placeholder="Enter cancellation reason..."
                                {...formik.getFieldProps("cancelReason")}
                            />
                            {formik.touched.cancelReason && formik.errors.cancelReason && (
                                <p className="text-red-500 text-sm">{formik.errors.cancelReason}</p>
                            )}
                            <div className="flex justify-end space-x-4">
                                <Button variant="outline" onClick={closeModal}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="destructive">
                                    Submit
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isPrescriptionModalOpen} onOpenChange={setIsPrescriptionModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Prescription</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={prescriptionFormik.handleSubmit} className="space-y-4">
                        <div>
                            <p className="font-semibold">Patient: {appointment?.patientName || "N/A"}</p>

                        </div>
                        <Textarea
                            placeholder="Enter prescription..."
                            {...prescriptionFormik.getFieldProps("prescription")}
                        />
                        {prescriptionFormik.touched.prescription && prescriptionFormik.errors.prescription && (
                            <p className="text-red-500 text-sm">{prescriptionFormik.errors.prescription}</p>
                        )}
                        <div className="flex justify-end space-x-4">
                            <Button variant="outline" onClick={closePrescriptionModal}>
                                Cancel
                            </Button>
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}