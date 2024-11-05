import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { useLocation, useNavigate } from 'react-router-dom'

// interface AppointmentProps {
//     appointment: {
//         _id: string
//         userId: string
//         doctorId: string
//         patientName: string
//         date: string
//         start: string
//         end: string
//         status: string
//         fees: number
//         paymentMethod: string
//         paymentStatus: string
//         paymentId: string
//         prescription: string | null
//         reason: string | null
//     }

// }

export default function AppointmentDetails() {
    const [isChatEnabled, setIsChatEnabled] = useState(false)
    const location = useLocation()
    const { appointment } = location.state || {}
    const navigate = useNavigate()

    useEffect(() => {
        const checkChatAvailability = () => {
            const now = new Date()
            const startTime = new Date(appointment.start)
            setIsChatEnabled(now >= startTime)
        }

        checkChatAvailability()
        const timer = setInterval(checkChatAvailability, 60000) // Check every minute

        return () => clearInterval(timer)
    }, [appointment.start])

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'MMMM d, yyyy')
    }

    const formatTime = (dateString: string) => {
        return format(new Date(dateString), 'h:mm a')
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-500'
            case 'pending':
                return 'bg-yellow-500'
            case 'cancelled':
                return 'bg-red-500'
            default:
                return 'bg-gray-500'
        }
    }
    const onCancel = () => {
        console.log("clicked")
    }
    const onAddPrescription = () => {
        console.log("clicked onAddPrescription")
    }
    const onChat = () => {
        console.log("appointment :", appointment)
        navigate("/doctor/chat", { state: { appointment } })
    }

    return (
        <Card className="w-[90%] mx-auto my-auto shadow-2xl">
            <CardHeader>
                <CardTitle className="text-2xl">Appointment Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold">Patient Name</h3>
                        <p>{appointment.patientName}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Patient ID</h3>
                        <p>{appointment.userId}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Appointment ID</h3>
                        <p>{appointment._id}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Date</h3>
                        <p>{formatDate(appointment.date)}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Time</h3>
                        <p>{formatTime(appointment.start)} - {formatTime(appointment.end)}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Status</h3>
                        <Badge className={`${getStatusColor(appointment.status)} text-white`}>
                            {appointment.status}
                        </Badge>
                    </div>
                    <div>
                        <h3 className="font-semibold">Fees</h3>
                        <p>Rs.{appointment.fees}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Payment Method</h3>
                        <p>{appointment.paymentMethod}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Payment Status</h3>
                        <p>{appointment.paymentStatus}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Payment ID</h3>
                        <p>{appointment.paymentId}</p>
                    </div>
                </div>
                {appointment.reason && (
                    <div className="mt-4">
                        <h3 className="font-semibold">Reason for Visit</h3>
                        <p>{appointment.reason}</p>
                    </div>
                )}
                {appointment.prescription && (
                    <div className="mt-4">
                        <h3 className="font-semibold">Prescription</h3>
                        <p>{appointment.prescription}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="destructive" onClick={onCancel}>
                    Cancel Appointment
                </Button>
                <div className="space-x-2">
                    {appointment.status.toLowerCase() === 'completed' && (
                        <Button onClick={onAddPrescription}>
                            Add Prescription
                        </Button>
                    )}
                    <Button
                        onClick={onChat}
                        disabled={!isChatEnabled}
                        variant={isChatEnabled ? "default" : "secondary"}
                    >
                        {isChatEnabled ? "Start Chat" : "Chat Unavailable"}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}