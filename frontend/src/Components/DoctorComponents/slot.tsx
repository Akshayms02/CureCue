import React, { useState } from 'react';
import { format, addMinutes, isAfter } from 'date-fns';
import { toast } from 'sonner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RootState } from '../../Redux/store';
import { useSelector } from 'react-redux';
import { addSlots, checkAvialability } from '../../services/doctorServices';
import Chip from '@mui/material/Chip';



interface TimeSlot {
    start: Date;
    end: Date;
}

const AddSlotModal: React.FC<{ setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>, setAvailableSlots: React.Dispatch<React.SetStateAction<any>>, Pdate: any }> = ({ setIsModalOpen, setAvailableSlots, Pdate }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(false); //Loading state
    const DoctorData = useSelector((state: RootState) => state.doctor);
console.log("parent date",Pdate)

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        setTimeSlots([]);
        setStartTime(null);
        setEndTime(null);
    };
    const handleTimeChange = (isStartTime: boolean, time: string) => {
        if (!selectedDate) return; //Early exit if no date is selected

        const [hours, minutes] = time.split(':');
        const newTime = new Date(selectedDate);
        newTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

        const hour = newTime.getHours();
        if (hour < 9 || hour >= 21) {
            toast.error('Please select a time between 9 AM and 9 PM.');
            return; // Prevent invalid time selection
        }

        if (isStartTime) {
            setStartTime(newTime);
        } else {
            setEndTime(newTime);
        }
    };
    const addSlot = async () => {
        if (!selectedDate || !startTime || !endTime) {
            toast.error('Please select a date and start/end times.');
            return;
        }

        if (!isAfter(endTime, startTime)) {
            toast.error('End time must be after start time.');
            return;
        }

        const timeDifferenceMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

        if (timeDifferenceMinutes < 30 || timeDifferenceMinutes > 60) {
            toast.error('Sessions must be atleast 30 mins and atmost 60 mins');
            return;
        }



        const hasOverlap = timeSlots.some((slot) => {
            const existingStart = slot.start;
            const existingEnd = slot.end;


            return (
                (isAfter(startTime, existingStart) && startTime < existingEnd) || (isAfter(endTime, existingStart) && endTime <= existingEnd) || (startTime <= existingStart && isAfter(endTime, existingEnd))
            );
        });

        if (hasOverlap) {
            toast.error('The selected time slot overlaps with an existing slot.');
            return;
        }

        setIsLoading(true);
        try {
            const requestBody = {
                doctorId: DoctorData?.doctorInfo?.doctorId,
                date: format(selectedDate, 'yyyy-MM-dd',),
                start: startTime.toISOString(),
                end: endTime.toISOString(),
            }
            console.log(requestBody)
            const response = await checkAvialability(requestBody)
            console.log(response)

            if (response?.data.available) {
                setTimeSlots([...timeSlots, { start: startTime, end: endTime }]);
                setStartTime(null);
                setEndTime(null);
                toast.success('Slot added!');
            } else {
                toast.error('Selected time slot overlaps with existing appointments.');
            }
        } catch (error) {
            toast.error('Error checking slot availability.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveAllSlots = async () => {
        if (timeSlots.length === 0) {
            toast.warning('No slots selected.');
            return;
        }

        setIsLoading(true);
        try {
            const requestBody = {
                doctorId: DoctorData?.doctorInfo?.doctorId,
                date: format(selectedDate!, 'yyyy-MM-dd'),
                timeSlots: timeSlots.map((slot) => ({
                    start: slot.start.toISOString(),
                    end: slot.end.toISOString(),
                })),
            }
            console.log(requestBody)
            const response = await addSlots(requestBody)
            console.log(response)
            if (response.message === "Successful") {
                const newAvailableSlots = timeSlots.map((slot) => ({
                    start: slot.start,
                    end: slot.end,
                    isBooked: false,  // Assuming new slots are not booked
                    isOnHold: false   // Assuming new slots are not on hold
                }));
                console.log(Pdate,selectedDate)
                if (selectedDate?.toISOString() === Pdate.toISOString()) {
                    setAvailableSlots((prevSlots) => [...prevSlots, ...newAvailableSlots]);
                }

                toast.success('Slots saved successfully!');
                setTimeSlots([]);
                setIsModalOpen(false);
                setSelectedDate(null);
                setStartTime(null);
                setEndTime(null);
            }
        } catch (error) {
            toast.error('Error saving slots.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    function handleDelete(indexToDelete: number): void {
        setTimeSlots((prevSlots) => prevSlots.filter((_, index) => index !== indexToDelete));
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-1/2">
                <h2 className="text-lg font-semibold mb-4">Add Slot</h2>

                <div className="mb-4">
                    <label htmlFor="date" className="block text-gray-700 font-bold mb-2">Select Date:</label>
                    <DatePicker
                        id="date"
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="MMMM d, yyyy"
                        className="border px-3 py-2 rounded-lg w-full"
                        placeholderText="Select a Date"
                        minDate={new Date()}
                        maxDate={addMinutes(new Date(), 60 * 24 * 10)} //10 days from now
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="startTime" className="block text-gray-700 font-bold mb-2">Start Time:</label>
                    <input
                        id="startTime"
                        type="time"
                        value={startTime ? format(startTime, 'HH:mm') : ''}
                        onChange={(e) => handleTimeChange(true, e.target.value)}
                        className="border p-2 rounded w-full"
                    />

                    <label htmlFor="endTime" className="block text-gray-700 font-bold mb-2 mt-2">End Time:</label>
                    <input
                        id="endTime"
                        type="time"
                        value={endTime ? format(endTime, 'HH:mm') : ''}
                        onChange={(e) => handleTimeChange(false, e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                    <button
                        onClick={addSlot}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mt-4"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adding...' : 'Add Slot'}
                    </button>
                </div>

                <ul className='flex flex-wrap gap-4'>
                    {timeSlots.map((slot, index) => (
                        <li key={index} className="mb-2 w-44 h-8 px-3 pb-2 text-green-500 rounded-3xl flex justify-between">
                            <Chip
                                label={`${format(slot.start, 'h:mm a')} - ${format(slot.end, 'h:mm a')}`}
                                onDelete={() => handleDelete(index)}
                                style={{ width: 'auto' }}
                            />
                        </li>
                    ))}

                </ul>


                <div className="flex justify-end mt-4">
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded-lg mr-2"
                        onClick={() => {
                            setIsModalOpen(false);
                            setSelectedDate(null);
                            setTimeSlots([]);
                            setStartTime(null);
                            setEndTime(null);
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-black hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
                        onClick={saveAllSlots}
                        disabled={isLoading} //Disable button while loading
                    >
                        {isLoading ? 'Saving...' : 'Save Slots'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSlotModal;