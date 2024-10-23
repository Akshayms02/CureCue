import { IDoctorRepository } from "../interfaces/IDoctorRepository";
import doctorModel, { IDoctor } from "../models/doctorModel";
import doctorApplicationModel from "../models/doctorApplicationModel";
import bcrypt from "bcrypt";
import { DoctorData } from "../interfaces/doctorInterfaces";
import { docDetails } from "../controllers/doctorController";
import Slot from "../models/doctorSlotsModel";
import appointmentModel from "../models/appointmentModel";

export class DoctorRepository implements IDoctorRepository {
  async existUser(email: string): Promise<IDoctor | null> {
    return await doctorModel.findOne({ email });
  }

  async createUser(userData: IDoctor): Promise<IDoctor> {
    try {
      const newUser = new doctorModel(userData);
      return await newUser.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error creating a new user: ${error.message}`);
      } else {
        throw new Error("Unknown error has occured");
      }
    }
  }

  async userLoginValidate(email: string, password: string): Promise<IDoctor> {
    try {
      const user = await doctorModel
        .findOne(
          { email },
          {
            _id: 0,
            doctorId: 1,
            name: 1,
            email: 1,
            phone: 1,
            password: 1,
            isBlocked: 1,
            kycStatus: 1,
            DOB: 1,
            department: 1,
            fees: 1,
            gender: 1,
            image: 1,
          }
        )
        .populate("department");

      if (!user) {
        throw new Error("User doesnt Exist");
      }

      const PassCompare = await bcrypt.compare(password, user.password);
      if (!PassCompare) {
        throw new Error("Invalid Password");
      }

      if (user.isBlocked == true) {
        throw new Error("User is blocked");
      }

      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("Unknown Error from DoctorRepositary");
      }
    }
  }

  async uploadDoctorData(
    data: DoctorData,
    docDetails: docDetails
  ): Promise<any> {
    try {
      const doctorData = await doctorModel.findOneAndUpdate(
        { email: data.email },
        { kycStatus: "submitted" },
        {
          new: true,
        }
      );
      if (doctorData) {
        const details = {
          doctorId: doctorData._id,
          name: data.name,
          DOB: data.dob,
          department: data.department,
          gender: data.gender,
          image: docDetails.profileUrl,
          fees: data.fees,
          kycDetails: {
            certificateImage: docDetails.certificateUrl,
            qualificationImage: docDetails.qualificationUrl,
            adharFrontImage: docDetails.aadhaarFrontImageUrl,
            adharBackImage: docDetails.aadhaarBackImageUrl,
            adharNumber: data.aadhaarNumber,
          },
        };

        await doctorApplicationModel.create(details);

        return doctorData;
      } else {
        return false;
      }
    } catch (error: any) {
      throw new Error(`Something went wrong : ${error}`);
    }
  }

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
      console.log("slot:", availableSlots);

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

  async getDoctorData(doctorId: string) {
    try {
      console.log(doctorId);
      const user = await doctorModel
        .findOne(
          { doctorId },
          {
            _id: 0,
            doctorId: 1,
            name: 1,
            email: 1,
            phone: 1,
            password: 1,
            isBlocked: 1,
            kycStatus: 1,
            DOB: 1,
            department: 1,
            fees: 1,
            gender: 1,
            image: 1,
          }
        )
        .populate("department")
        .lean();

      return user;
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
  async findAppointmentsByDoctor(doctorId: string) {
    try {
      const appointments = await appointmentModel.find({ doctorId });
      return appointments;
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}
