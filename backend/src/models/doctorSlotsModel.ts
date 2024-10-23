import mongoose, { Document, Schema, Model } from "mongoose";

interface ITimeSlot {
  start: Date;
  end: Date;
  isBooked: boolean;
  isOnHold: boolean;
  heldBy?: string; // Store the user ID holding the slot
  holdExpiresAt?: Date;
}

interface ISlot extends Document {
  doctorId: string; // Using ObjectId for references
  date: Date;
  timeSlots: ITimeSlot[];
}

interface SlotModel extends Model<ISlot> {
  holdSlot(
    doctorId: string,
    date: Date,
    startTime: Date,
    userId: string,
    holdDurationMinutes?: number
  ): Promise<ISlot | null>;

  releaseSlot(
    doctorId: string,
    date: Date,
    startTime: Date
  ): Promise<ISlot | null>;

  bookSlot(
    doctorId: string,
    date: Date,
    startTime: Date,
    userId: string
  ): Promise<ISlot | null>;
}

const timeSlotSchema: Schema = new Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  isBooked: { type: Boolean, default: false },
  isOnHold: { type: Boolean, default: false },
  heldBy: { type: String, ref: "User",default:null },
  holdExpiresAt: { type: Date },
});

const slotSchema: Schema = new Schema<ISlot>({
  doctorId: {
    type: String,
    ref: "Doctor",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlots: [timeSlotSchema],
});

// Indexes to optimize searches
slotSchema.index({ doctorId: 1, date: 1 });

// Method to hold a time slot
slotSchema.statics.holdSlot = async function (
  doctorId: string,
  date: Date,
  startTime: Date,
  userId: string,
  holdDurationMinutes: number = 5
): Promise<ISlot | null> {
  const holdExpiresAt = new Date();
  holdExpiresAt.setMinutes(holdExpiresAt.getMinutes() + holdDurationMinutes);

  const updateResult = await this.findOneAndUpdate(
    {
      doctorId,
      date,
      "timeSlots.start": startTime,
      "timeSlots.isBooked": false, // Slot is not booked
      "timeSlots.isOnHold": false, // Slot is not on hold
    },
    {
      $set: {
        "timeSlots.$.isOnHold": true,
        "timeSlots.$.heldBy": userId,
        "timeSlots.$.holdExpiresAt": holdExpiresAt,
      },
    },
    { new: true }
  );

  return updateResult;
};

// Method to release a held time slot
slotSchema.statics.releaseSlot = async function (
  doctorId: string,
  date: Date,
  startTime: Date
): Promise<ISlot | null> {
  const updateResult = await this.findOneAndUpdate(
    {
      doctorId,
      date,
      "timeSlots.start": startTime,
      "timeSlots.isOnHold": true,
    },
    {
      $set: {
        "timeSlots.$.isOnHold": false,
        "timeSlots.$.heldBy": null,
        "timeSlots.$.holdExpiresAt": undefined,
      },
    },
    { new: true }
  );
  return updateResult;
};

// Method to book a held time slot
slotSchema.statics.bookSlot = async function (
  doctorId: string,
  date: Date,
  startTime: Date,
  userId: string
): Promise<ISlot | null> {
  const updateResult = await this.findOneAndUpdate(
    {
      doctorId,
      date,
      "timeSlots.start": startTime,
      "timeSlots.isOnHold": true,
      "timeSlots.heldBy": userId, // Ensure the user holding the slot is booking it
    },
    {
      $set: {
        "timeSlots.$.isBooked": true,
        "timeSlots.$.isOnHold": false, // No longer on hold
        "timeSlots.$.heldBy": userId, // Keep the userId for booked appointments
        "timeSlots.$.holdExpiresAt": undefined,
      },
    },
    { new: true }
  );
  return updateResult;
};

const Slot = mongoose.model<ISlot, SlotModel>("Slot", slotSchema);

export default Slot;
