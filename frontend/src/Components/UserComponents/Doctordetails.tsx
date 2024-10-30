import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAvialableTimeslots, getDoctorData } from '../../services/userServices';
import { format } from 'date-fns';
import { toast } from 'sonner';
import axiosUrl from '../../Utils/axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardTitle, CardDescription } from "../../../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Badge } from "../../../components/ui/badge"

interface Department {
    name: string
}

interface DoctorInfo {
    name: string;
    department: Department
    phone: string;
    fees: string;
    profileUrl: string,
    gender: string
    email: string
    doctorId: string
}

interface TimeSlots {
    start: Date
    end: Date
    isBooked: boolean
    isOnHold: boolean
    holdExpiresAt: string
    _id: string
}

interface UserInfo {
    name: string;
    email: string;
    userId: string;
    phone: string;
    gender: string;
    DOB: string;
    profileImage: any;
    bio: string;
}

const Doctordetails: React.FC = () => {
    const { doctorId } = useParams<{ doctorId: string }>();
    const [userData, setUserData] = useState<UserInfo | null>(null);
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [timeslots, setTimeslots] = useState<TimeSlots[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [doctorData, setDoctorData] = useState<DoctorInfo | null>(null)
    const [selectedTimeslot, setSelectedTimeslot] = useState<Date | null>(null);

    useEffect(() => {
        const storedData = localStorage.getItem("userInfo");
        if (storedData) {
            setUserData(JSON.parse(storedData) as UserInfo);
        }
    }, []);

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const response = await getDoctorData(doctorId as string)
                console.log(response)
                setDoctorData(response as any)
            } catch (error: any) {
                console.log(error)
            }
        }

        fetchDoctorDetails()
    }, [doctorId])

    useEffect(() => {
        const fetchTimeslots = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (selectedDate) {
                    const date = format(selectedDate, 'yyyy-MM-dd',)
                    const response: any = await fetchAvialableTimeslots(doctorId as string, date as string)
                    if (response?.length < 0) {
                        setTimeslots([])
                    } else {
                        const slots = response?.data.map((slot: any) => ({
                            start: new Date(slot.start),
                            end: new Date(slot.end),
                            isBooked: slot.isBooked,
                            isOnHold: slot.isOnHold,
                            _id: slot._id
                        }));
                        const filterSlots = slots.filter((elem: TimeSlots) => elem.isBooked == false)
                        console.log(response)
                        setTimeslots(filterSlots);
                    }
                }
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTimeslots();
    }, [selectedDate, doctorId]);

    const handlePayment = async () => {
        if (!selectedTimeslot) {
            toast.error("Please select a timeslot.");
            return;
        }

        try {
            const holdSlotResponse = await axiosUrl.post(`api/user/holdTimeslot`, {
                doctorId: doctorData?.doctorId,
                startTime: selectedTimeslot,
                userId: userData?.userId,
                date: selectedDate
            });

            if (holdSlotResponse.data.success) {
                console.log("Slot held successfully");

                const options = {
                    key: "rzp_test_7PE24PnF4GNlR0",
                    amount: parseInt(doctorData?.fees as string) * 100,
                    currency: "INR",
                    name: "CureCue",
                    description: "Appointment Payment",
                    handler: async function (response: {
                        razorpay_payment_id: any;
                        razorpay_order_id: any;
                    }) {
                        try {
                            await axiosUrl.post(`api/user/createAppointment`, {
                                amount: parseInt(doctorData?.fees as string),
                                currency: "INR",
                                email: doctorData?.email,
                                doctorId: doctorData?.doctorId,
                                userId: userData?.userId,
                                paymentId: response.razorpay_payment_id,
                                orderId: response.razorpay_order_id,
                                timeslotId: selectedTimeslot,
                                patientName: userData?.name,
                                date: selectedDate
                            });

                            toast.success("Payment successful and appointment booked.");
                            setTimeout(() => {
                                navigate("/");
                            }, 1500);
                        } catch (error) {
                            console.error("Error saving appointment:", error);
                            toast.error("Failed to save appointment.");
                        }
                    },
                    prefill: {
                        name: userData?.name,
                        email: userData?.email,
                        contact: userData?.phone,
                    },
                };

                const paymentObject = new (window as any).Razorpay(options);
                paymentObject.open();
            } else {
                toast.error("Failed to hold the slot. Please try again.");
            }
        } catch (error: any) {
            if (error.status == 400) {
                toast.error("Slot is On hold Please Select another Slot")
            } else if (error.status == 401) {
                toast.error("Please Login first")
            }
            else {
                console.log(error.message)
                console.error("Error during holding slot or payment process:", error);
                toast.error("Error during the process.");
            }
        }
    };

    return (
        <div className='min-h-screen pb-16 bg-gray-100'>
            <div className='h-64 md:h-96 w-full bg-cover bg-center'
                style={{
                    backgroundImage: `url("https://images.pexels.com/photos/139398/thermometer-headache-pain-pills-139398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`,
                }}>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="mt-[-64px] md:mt-[-96px]">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="md:w-1/3">
                                <Avatar className="w-full h-64 md:h-96">
                                    <AvatarImage src={doctorData?.profileUrl} alt={doctorData?.name} />
                                    <AvatarFallback>{doctorData?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="md:w-2/3">
                                <CardTitle className="text-3xl font-bold mb-2">Dr. {doctorData?.name}</CardTitle>
                                <CardDescription className="text-xl mb-2">{doctorData?.department?.name}</CardDescription>
                                <Badge variant="secondary" className="mb-4">12 Years Experience</Badge>
                                <p className="text-gray-700 mb-6">
                                    {`Dr. ${doctorData?.name} has extensive experience across multiple clinical branches, specializing in ${doctorData?.department?.name}. With a strong foundation in patient care and medical expertise, Dr. ${doctorData?.name} is committed to providing high-quality healthcare services. Their dedication to medical excellence has positively impacted numerous patients throughout their career.`}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                        <span className="text-gray-700">Call: {doctorData?.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                        <span className="text-gray-700">Email: {doctorData?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">Fees: {doctorData?.fees}</span>
                                    </div>
                                </div>
                                <Button onClick={() => setIsModalOpen(true)}>
                                    Book Appointment
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Book Appointment</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date: Date | null) => {
                                setSelectedDate(date);
                                setSelectedTimeslot(null);
                            }}
                            dateFormat="yyyy-MM-dd"
                            disabled={isLoading}
                            className='w-full border border-gray-300 rounded-md h-11 px-3 mb-4'
                            minDate={new Date()}
                            maxDate={new Date(new Date().setDate(new Date().getDate() + 10))}
                        />

                        {isLoading && <p className="text-gray-500">Loading timeslots...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        {timeslots.length > 0 ? (
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">Available Timeslots:</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {timeslots.map((slot) => (
                                        <Button
                                            key={slot._id}
                                            variant={selectedTimeslot?.getTime() === slot.start.getTime() ? "default" : "outline"}
                                            onClick={() => setSelectedTimeslot(slot.start)}
                                        >
                                            {slot.start.toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}
                                            {" - "}
                                            {slot.end.toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}
                                        </Button>
                                    ))}
                                </div>
                                <p className="text-gray-700 mt-4">Fees: {doctorData?.fees}</p>
                            </div>
                        ) : (
                            <div className="mt-4">
                                <p className="text-gray-700">No slots are available for this Date, Please Select another Date</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handlePayment} disabled={!selectedTimeslot}>
                            Book Now
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Doctordetails;