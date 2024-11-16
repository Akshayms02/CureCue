import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ChevronRightIcon } from 'lucide-react'
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select"
import { Badge } from "../../../components/ui/badge"
import { toast } from 'sonner'
import doctorAxiosUrl from '../../Utils/doctorAxios'
import { useNavigate } from 'react-router-dom'


interface Appointment {
    _id: string
    patientName: string
    date: string
    start: string
    end: string
    status: string
}

export default function AppointmentList() {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(false)
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const DoctorData = localStorage.getItem("doctorInfo")
    const parsedDocData = JSON.parse(DoctorData as string)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true)
            try {
                const response = await doctorAxiosUrl.get(`/api/doctor/appointments/${parsedDocData.doctorId}`)
                setAppointments(response.data)
            } catch (err: any) {
                console.log(err)
                toast.error('Failed to fetch appointments.')
            } finally {
                setLoading(false)
            }
        }

        fetchAppointments()
    }, [])

    const filteredAppointments = appointments.filter(appointment =>
        statusFilter === 'all' || appointment.status === statusFilter
    )

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge variant="success">Completed</Badge>
            case 'cancelled':
                return <Badge variant="destructive">Cancelled</Badge>
            case "prescription pending":
                return <Badge variant="secondary">Prescription pending</Badge>
            default:
                return <Badge variant="secondary">Pending</Badge>
        }
    }

    const viewDetails = (appointment: any) => {
        console.log(appointment)
        navigate('/doctor/appointmentDetails', { state: { appointment: appointment } })

    }

    if (loading) return <div className="flex justify-center items-center h-screen">Loading appointments...</div>


    return (
        <Card className="w-full max-w-4xl mx-auto my-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Appointment Listing</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-end mb-4">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="prescription pending">Prescription Pending</SelectItem>

                        </SelectContent>
                    </Select>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient Name</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAppointments.map((appointment) => (
                            <TableRow key={appointment._id}>
                                <TableCell className="font-medium">{appointment.patientName}</TableCell>
                                <TableCell>{format(new Date(appointment.date), 'PPP')}</TableCell>
                                <TableCell>
                                    {format(new Date(appointment.start), 'p')} -
                                    {format(new Date(appointment.end), 'p')}
                                </TableCell>
                                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" onClick={() => viewDetails(appointment)}>
                                        View Details
                                        <ChevronRightIcon className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
