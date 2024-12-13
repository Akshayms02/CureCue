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
import { useNavigate } from 'react-router-dom'
import { getAllAppointments } from '../../services/doctorServices'

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
    const [statusFilter, setStatusFilter] = useState<string>('All')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const DoctorData = localStorage.getItem("doctorInfo")
    const parsedDocData = JSON.parse(DoctorData as string)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true)
            try {
                const response = await getAllAppointments(parsedDocData?.doctorId as string, currentPage as number, statusFilter as string)
                console.log(response)
                setAppointments(response?.data.appointments)
                setTotalPages(response?.data.totalPages)
            } catch (err: any) {
                console.log(err)
                toast.error('Failed to fetch appointments.')
            } finally {
                setLoading(false)
            }
        }

        fetchAppointments()
    }, [currentPage, statusFilter])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge variant="success">Completed</Badge>
            case 'cancelled':
                return <Badge variant="destructive">Cancelled</Badge>
            case "prescription pending":
                return <Badge variant="secondary">Prescription pending</Badge>
            case "cancelled by Doctor":
                return <Badge variant="destructive">Cancelled by Yourself</Badge>
            default:
                return <Badge variant="secondary">Pending</Badge>
        }
    }

    const viewDetails = (appointment: any) => {
        console.log(appointment)
        navigate('/doctor/appointmentDetails', { state: { appointment: appointment } })
    }

    const handlePageChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && currentPage > 1) {
            setCurrentPage((prev) => prev - 1)
        } else if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1)
        }
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
                            <SelectItem value="All">All Statuses</SelectItem>
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
                        {appointments.map((appointment) => (
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
                <div className="flex justify-between mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange('prev')}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange('next')}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
