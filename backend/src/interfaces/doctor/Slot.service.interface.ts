interface ISlotTimeSlot {
  start: Date;
  end: Date;
  isBooked?: boolean;
  isOnHold?: boolean;
  heldBy?: string;
  holdExpiresAt?: Date | null;
}
export interface ISlotService {
  scheduleSlot(
    date: string,
    timeSlots: any[],
    doctorId: string
  ): Promise<{ status: boolean } | undefined>;
  checkSlots(
    doctorId: string,
    date: string
  ): Promise<ISlotTimeSlot[] | undefined>;
  checkAvialability(
    doctorId: string,
    date: string,
    start: string,
    end: string
  ): Promise<{ available: boolean } | undefined>;
  deleteSlot(
    start: string,
    doctorId: string,
    date: string
  ): Promise<{ status: boolean } | undefined>;
  checkStatus(
    email: string
  ): Promise<{ isBlocked: boolean; kycStatus: string } | any>
}
