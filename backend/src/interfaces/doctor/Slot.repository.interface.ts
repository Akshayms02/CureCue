import { IUser } from "../../models/userModel";

interface ISlotTimeSlot {
  start: Date;
  end: Date;
  isBooked?: boolean;
  isOnHold?: boolean;
  heldBy?: string;
  holdExpiresAt?: Date | null;
}

export interface ISlotRepository {
  createSlot(
    parsedDate: Date,
    formattedTimeSlots: ISlotTimeSlot[],
    doctorId: string
  ): Promise<
    | {
        status: boolean;
        message?: string;
        overlappingSlots?: ISlotTimeSlot[];
      }
    | undefined
  >;
  checkSlots(
    doctorId: string,
    date: string
  ): Promise<ISlotTimeSlot[] | undefined>;
  deleteSlot(
    start: string,
    doctorId: string,
    date: string
  ): Promise<{ status: boolean } | undefined>;

  checkAvialability(
    doctorId: string,
    parsedDate: Date,
    parsedStart: Date,
    parsedEnd: Date
  ): Promise<{ available: boolean }>;
  existUser(email: string): Promise<IUser | null>
}
