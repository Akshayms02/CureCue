import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import { fetchAvialableTimeslots, getDoctorData } from '../../services/userServices';
import { format } from 'date-fns';

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
}

interface TimeSlots {
    start: Date
    end: Date
    isBooked: string
    isOnHold: boolean
    holdExpiresAt: string
    _id: string
}

const Doctordetails: React.FC = () => {
    const { doctorId } = useParams<{ doctorId: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [timeslots, setTimeslots] = useState<TimeSlots[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [doctorData, setDoctorData] = useState<DoctorInfo | null>(null)
    const [selectedTimeslot, setSelectedTimeslot] = useState<string | null>(null);

    const doctor = {
        name: 'Dr. Bernadette Carr',
        speciality: 'M.Sc - Anatomy, General Physician',
        experience: '12 Years Experience',
        description:
            'Dr. Bernadette has served in a variety of clinical branches and has extensive clinical experience. She has worked in the Dept. of surgery, Dept. of Gynaecology and Dept. of Medicine.',
        recommendations: 84,
        address: 'Ladislava Dérera 2740/7, 831 01 Bratislava, Slovakia - 911 01',
        phone: '+421 2/547 778 29',
        timings: 'Open all days',
        fees: 'Rs.1999',
    };

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
    }, [])

    useEffect(() => {
        const fetchTimeslots = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (selectedDate) {
                    const date = format(selectedDate, 'yyyy-MM-dd',)
                    const response = await fetchAvialableTimeslots(doctorId as string, date as string)
                    if (response?.length < 0) {
                        setTimeslots([])
                    } else {
                        const slots = response?.data.map((slot: any) => ({
                            start: new Date(slot.start),
                            end: new Date(slot.end),
                            isBooked: slot.isBooked,
                            isOnHold: slot.isOnHold
                        }));
                        console.log(response)
                        setTimeslots(slots);
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

    return (
        <div className='h-screen pb-64 '>
            <div className='h-1/2 w-full'
                style={{
                    backgroundImage: `url("https://images.pexels.com/photos/139398/thermometer-headache-pain-pills-139398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                }}>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-2xl flex gap-8 justify-center items-center  mx-48">
                <div className="w-1/3 -mt-72 drop-shadow-lg h-1/4">
                    <img
                        src={doctorData?.profileUrl}
                        alt={doctorData?.profileUrl}
                        className="rounded-lg w-full h-96 object-cover"
                    />
                </div>
                <div className="w-2/3">
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Dr. {doctorData?.name}</h2>
                        <p className="text-gray-600">Department: {doctorData?.department?.name}</p>
                        <p className="text-gray-600">{doctor?.experience}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-gray-700">{`Dr. ${doctorData?.name} has extensive experience across multiple clinical branches, specializing in ${doctorData?.department?.name}. With a strong foundation in patient care and medical expertise, Dr. ${doctorData?.name} is committed to providing high-quality healthcare services. Their dedication to medical excellence has positively impacted numerous patients throughout their career.`}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-gray-600">
                            {/* {doctor?.recommendations} recommendations */}
                        </p>
                    </div>
                    <div className=' flex justify-end mt-10'>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 "
                        >
                            Book Appointment
                        </button>
                    </div>
                </div>
                <div className="w-1/4">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Contact Details :
                    </h3>
                    {/* <p className="text-gray-700">{doctor.address}</p> */}
                    <p className="text-gray-700 mt-4">Call: {doctorData?.phone}</p>
                    <p className="text-gray-700">Email: {doctorData?.email}</p>
                    <p className="text-gray-700">Fees: {doctorData?.fees}</p>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-1/2"> {/* Increased width here */}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                            >
                                &times;
                            </button>
                            <div>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    dateFormat="yyyy-MM-dd"
                                    disabled={isLoading}
                                    className='border border-gray-300 rounded-md h-11 px-3 mb-4'
                                />
                                {isLoading && <p className="text-gray-500">Loading timeslots...</p>}
                                {error && <p className="text-red-500">{error}</p>}
                                {timeslots.length > 0 ? (
                                    <div className="mt-4">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Available Timeslots:</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {timeslots.map((slot,index) => (
                                                <div className='border px-3 py-2 rounded-lg bg-blue-200 flex justify-between items-center' key={index}>
                                                    <span>
                                                        {slot.start.toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: true,
                                                        })}{" "}
                                                        -{" "}
                                                        {slot.end.toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: true,
                                                        })}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-gray-700 mt-4">Fees: {doctorData?.fees}</p> {/* Displaying doctor's fees here */}
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        <p className="text-gray-700">No slots are available for this Date, Please Select another Date</p>
                                    </div>
                                )}
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(false); // Close the modal
                                            setSelectedDate(null); // Clear selected date
                                            setSelectedTimeslot(null); // Clear selected timeslot
                                        }}
                                        className="w-1/4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Handle booking logic here
                                            console.log("Booking for:", selectedDate, selectedTimeslot);
                                        }}
                                        className="w-1/4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded"
                                    >
                                        Book Now
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </div></div>

    );
};

export default Doctordetails;