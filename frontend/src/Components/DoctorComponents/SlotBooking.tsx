import { Calendar } from "../../../components/ui/calendar";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker"; // Importing DatePicker from react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Importing DatePicker styles

import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { toast } from "sonner";
import { FiTrash } from 'react-icons/fi';
import { addSlot, checkSlots, deleteSlot } from "../../services/doctorServices";

export function SlotBooking() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<{ start: Date; end: Date }[]>([]);
  const [availableSlots, setAvailableSlots] = useState<{ start: Date; end: Date, isBooked: boolean, isOnHold: boolean }[]>([]);

  const DoctorData = useSelector((state: RootState) => state.doctor);


  const fetchAvailableSlots = async (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    try {
      const localDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());


      const doctorId = DoctorData?.doctorInfo?.doctorId;
      const date = localDate.toISOString()


      const response = await checkSlots(doctorId, date);


      console.log(response)
      const fetchedSlots = response.map((slot: any) => ({
        start: new Date(slot.start),
        end: new Date(slot.end),
        isBooked: slot.isBooked,
        isOnHold: slot.isOnHold
      }));


      setAvailableSlots(fetchedSlots);


    } catch (error: any) {
      setAvailableSlots([]);
      console.log(error)
    }
  };




  // Dynamically generate time slots based on the selected date
  const generateTimeSlots = (selectedDate: Date | undefined) => {
    if (!selectedDate) return [];

    // Base times for the time slots (hours)
    const baseSlots = [
      { startHour: 9, endHour: 10 },
      { startHour: 10, endHour: 11 },
      { startHour: 11, endHour: 12 },
      { startHour: 13, endHour: 14 },
      { startHour: 14, endHour: 15 },
      { startHour: 15, endHour: 16 },
    ];

    // Generate time slots with adjusted dates
    return baseSlots.map((slot) => {
      const start = new Date(selectedDate);
      start.setHours(slot.startHour, 0, 0, 0);

      const end = new Date(selectedDate);
      end.setHours(slot.endHour, 0, 0, 0);

      return { start, end };
    });
  };

  // Generate time slots dynamically whenever a date is selected
  const [timeSlots, setTimeSlots] = useState<{ start: Date; end: Date }[]>(generateTimeSlots(selectedDate));

  useEffect(() => {
    setTimeSlots(generateTimeSlots(selectedDate));
  }, [selectedDate]);

  // Handle selecting time slots (deselect if already selected)
  const handleSelectTimeSlot = (slot: { start: Date; end: Date }) => {
    const now = new Date();

    // Check if the selected date is today
    const isToday = selectedDate?.toDateString() === now.toDateString();

    // Check if the slot's start time is in the past for today
    if (isToday && slot.start < now) {
      toast.error("You can't select a past time slot for today.");
      return;
    }

    const isSelected = selectedTime.find(
      (s) => s.start.getTime() === slot.start.getTime() && s.end.getTime() === slot.end.getTime()
    );
    if (isSelected) {
      setSelectedTime(selectedTime.filter((s) => s.start.getTime() !== slot.start.getTime()));
    } else {
      setSelectedTime([...selectedTime, slot]);
    }
  };

  // Handle adding the selected date and time slots
  const handleAddSlot = (selectedDate: Date | undefined, selectedTime: { start: Date; end: Date }[]) => {
    if (!selectedDate || selectedTime.length === 0) {
      alert("Please select both a date and at least one time slot.");
      return;
    }
    const localDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    // Format the request body
    const requestBody = {
      date: localDate.toISOString(),
      timeSlots: selectedTime.map((slot) => ({
        start: slot.start.toISOString(),
        end: slot.end.toISOString(),
      })),
      doctorId: DoctorData?.doctorInfo?.doctorId
    };
    console.log(requestBody);

    // API call to save slots
    addSlot(requestBody)
      .then((response) => {
        console.log("Slot added successfully:", response);
        toast.success("Slot Added successfully")
        setIsModalOpen(false);
        setSelectedDate(undefined);
        setSelectedTime([]);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message)
      });
  };

  useEffect(() => {
    if (date) {
      fetchAvailableSlots(date);
    }
  }, [date, handleAddSlot]);

  const handleDeleteSlot = async (slotStart: any, date: any) => {
    try {
      const doctorId = DoctorData?.doctorInfo?.doctorId
      const response = await deleteSlot(slotStart, doctorId, date);

      if (response?.status === 200) {
        setAvailableSlots((prevSlots) =>
          prevSlots.filter((slot) => slot.start !== slotStart)
        );
        toast.success("The Slot was successfully deleted")
      } else {
        console.error('Failed to delete slot');
      }
    } catch (error) {
      console.error('Error deleting slot:', error);
    }
  };


  return (
    <main className="flex h-full w-full">
      <section className="w-1/2 h-full px-20 flex flex-col justify-center py-40">

        <button
          className="mb-4 bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg w-1/4"
          onClick={() => setIsModalOpen(true)}
        >
          Add Slot
        </button>

        <div className="h-full w-full flex justify-center items-center bg-gray-200 rounded-xl shadow-2xl">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0); // Reset today's time to midnight for accurate comparison
              const maxDate = new Date(today);
              maxDate.setDate(today.getDate() + 10); // Set max date to 10 days from today

              return date < today || date > maxDate;
            }}
            initialFocus
          />
        </div>
      </section>

      <section className="w-1/2 h-full py-14 px-10">
        <div className="bg-gray-200 w-full h-full rounded-2xl shadow-2xl">
          <div className="px-5 py-10 h-full w-full">
            <h2 className="text-lg font-semibold mb-4">Available Slots for {date?.toDateString()}</h2>
            <div className="grid grid-cols-1 gap-3 mt-11">
              {availableSlots.length > 0 ? (
                availableSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="border px-3 py-2 rounded-lg bg-blue-200 flex justify-between items-center"
                  >
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


                    {slot.isBooked ? (
                      <span className="text-green-500">Booked</span>
                    ) : slot.isOnHold ? (
                      <span className="text-yellow-500">On Hold</span>
                    ) : (
                      <FiTrash
                        className="text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                        onClick={() => handleDeleteSlot(slot.start, date)}
                      />
                    )}
                  </div>
                ))
              ) : (
                <p>No slots available for the selected date.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-8 w-1/2">
            <h2 className="text-lg font-semibold mb-4">Add Slot</h2>

            {/* Date Picker */}
            <div className="mb-4">
              <p className="mb-2">Select a Date:</p>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date || undefined)}
                dateFormat="MMMM d, yyyy"
                className="border px-3 py-2 rounded-lg w-full"
                placeholderText="Select a Date"
                minDate={new Date()} // Minimum date is today
                maxDate={new Date(new Date().setDate(new Date().getDate() + 10))}
              />
            </div>

            {/* Time Slot Picker */}
            <div className="mb-4">
              <p className="mb-2">Select Time Slots:</p>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={`border px-3 py-2 rounded-lg cursor-pointer ${selectedTime.some(
                      (s) => s.start.getTime() === slot.start.getTime() && s.end.getTime() === slot.end.getTime()
                    )
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                      }`}
                    onClick={() => handleSelectTimeSlot(slot)}
                  >
                    {slot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} -{" "}
                    {slot.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </div>
                ))}
              </div>
            </div>


            <div className="flex justify-end">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg mr-2"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedDate(undefined);
                  setSelectedTime([]);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-black hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
                onClick={() => handleAddSlot(selectedDate, selectedTime)}
              >
                Add Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}