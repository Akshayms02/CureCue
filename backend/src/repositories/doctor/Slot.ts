import { ISlotRepository } from "../../interfaces/doctor/Slot.repository.interface";
import Slot from "../../models/doctorSlotsModel";
import userModel, { IUser } from "../../models/userModel";


export class SlotRepository implements ISlotRepository {
    async createSlot(
        parsedDate: any,
        formattedTimeSlots: any,
        doctorId: string
    ): Promise<any> {
        try {
            const existingSlot = await Slot.findOne({
                doctorId: doctorId,
                date: parsedDate,
            });
            if (existingSlot) {
                const overlappingSlots = formattedTimeSlots.filter((newSlot: any) => {
                    return existingSlot.timeSlots.some((existingTimeSlot: any) => {
                        const newStart = new Date(newSlot.start).getTime();
                        const newEnd = new Date(newSlot.end).getTime();
                        const existingStart = new Date(existingTimeSlot.start).getTime();
                        const existingEnd = new Date(existingTimeSlot.end).getTime();

                        // Check if there is any overlap
                        return (
                            (newStart >= existingStart && newStart < existingEnd) || // New slot starts within an existing slot
                            (newEnd > existingStart && newEnd <= existingEnd) || // New slot ends within an existing slot
                            (newStart <= existingStart && newEnd >= existingEnd) // New slot fully overlaps an existing slot
                        );
                    });
                });

                if (overlappingSlots.length > 0) {
                    // If there are overlapping slots, return an error
                    return {
                        status: false,
                        message: "Some of the time slots overlap with existing slots",
                        overlappingSlots,
                    };
                }

                // No overlapping slots, add the new slots to the existing slot document
                existingSlot.timeSlots.push(...formattedTimeSlots);
                const response = await existingSlot.save(); // Save the updated slot document

                if (response) {
                    return {
                        status: true,
                        message: "Added to the existing slot",
                    };
                }
            } else {
                // If the slot doesn't exist, create a new Slot document
                const newSlot = new Slot({
                    doctorId: doctorId,
                    date: parsedDate,
                    timeSlots: formattedTimeSlots,
                });

                const response = await newSlot.save();
                if (response) {
                    return { status: true, message: "Added slot as new" };
                }
            }
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }
    async checkSlots(doctorId: string, date: string) {
        try {
            const slot = await Slot.findOne({
                doctorId: doctorId as string,
                date: new Date(date as string),
            });
            if (!slot) {
                throw new Error("No slots on this date Exists");
            }

            const availableSlots = slot?.timeSlots?.map((element) => element);


            return availableSlots;
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }
    async deleteSlot(start: string, doctorId: string, date: string) {
        try {
            const slot = await Slot.findOne({ doctorId, date: new Date(date) });
            if (!slot) {
                throw new Error("Slot not found");
            }
            const updatedTimeSlots = slot.timeSlots.filter(
                (timeSlot) =>
                    timeSlot.start.toISOString() !== new Date(start).toISOString()
            );

            if (updatedTimeSlots.length === slot.timeSlots.length) {
                throw new Error("Time Slot Not Found");
            }

            slot.timeSlots = updatedTimeSlots;

            await slot.save();

            return { status: true };
        } catch (error: any) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }

    async checkAvialability(
        doctorId: string,
        parsedDate: Date,
        parsedStart: Date,
        parsedEnd: Date
    ) {
        const slot = await Slot.findOne({
            doctorId,
            date: parsedDate,
        });

        if (!slot) {
            return { available: true };
        }

        const isAvailable = !slot.timeSlots.some((s) => {
            const startTime = new Date(s.start);
            const endTime = new Date(s.end);
            return parsedStart < endTime && parsedEnd > startTime; // Check for overlap
        });

        return { available: isAvailable };
    }

    async existUser(email: string): Promise<IUser | null> {
        return await userModel.findOne({ email });
    }
}