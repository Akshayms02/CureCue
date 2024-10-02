import mongoose, { Document, Schema } from "mongoose";

interface ITimeSlot {
  start: Date;
  end: Date;
  isBooked: boolean;
  isOnHold: boolean;
  holdExpiresAt?: Date;
}

interface ISlot extends Document {
  doctorId: string;
  date: Date;
  timeSlots: ITimeSlot[];
}

const slotSchema: Schema = new Schema({
  doctorId: {
    type: String,
    ref: "Doctor",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlots: [
    {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
      isBooked: { type: Boolean, default: false },
      isOnHold: { type: Boolean, default: false },
      holdExpiresAt: { type: Date },
    },
  ],
});

const Slot = mongoose.model<ISlot>("Slot", slotSchema);
export default Slot;
