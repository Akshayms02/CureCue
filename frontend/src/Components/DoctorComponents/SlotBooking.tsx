import { Calendar } from "../../../components/ui/calendar";
import { useState, useEffect } from "react";
import { format } from 'date-fns';


import "react-datepicker/dist/react-datepicker.css";

import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { toast } from "sonner";
import { FiTrash } from 'react-icons/fi';
import { checkSlots, deleteSlot } from "../../services/doctorServices";
import AddSlotModal from "./slot";

export function SlotBooking() {
  const localDate = new Date();
  localDate.setHours(0, 0, 0, 0)
  const [date, setDate] = useState<Date | undefined>(localDate);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<{ start: Date; end: Date, isBooked: boolean, isOnHold: boolean }[]>([]);

  const DoctorData = useSelector((state: RootState) => state.doctor);



  const fetchAvailableSlots = async (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    try {
      const localDate = format(selectedDate, 'yyyy-MM-dd',)

      const doctorId = DoctorData?.doctorInfo?.doctorId;

      console.log(doctorId, localDate)

      const response = await checkSlots(doctorId, localDate);


      console.log(response)
      if (response) {
        const fetchedSlots = response.map((slot: any) => ({
          start: new Date(slot.start),
          end: new Date(slot.end),
          isBooked: slot.isBooked,
          isOnHold: slot.isOnHold
        }));
        setAvailableSlots(fetchedSlots);
      } else {
        setAvailableSlots([])
      }

    } catch (error: any) {
      setAvailableSlots([]);
      console.log(error)
    }
  };


  useEffect(() => {
    if (date) {
      fetchAvailableSlots(date);
    }
  }, [date]);

  const handleDeleteSlot = async (slotStart: any, date: any) => {
    try {
      const doctorId = DoctorData?.doctorInfo?.doctorId
      const localDate = format(date, 'yyyy-MM-dd',)
      console.log(slotStart, doctorId, localDate)

      const response = await deleteSlot(slotStart, doctorId, localDate);

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
              today.setHours(0, 0, 0, 0);
              const maxDate = new Date(today);
              maxDate.setDate(today.getDate() + 10);

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

      {isModalOpen && (<AddSlotModal setIsModalOpen={setIsModalOpen} setAvailableSlots={setAvailableSlots} Pdate={date} />
      )}
    </main>
  );
}