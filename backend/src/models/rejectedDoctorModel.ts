import mongoose, { Document, Schema } from "mongoose";

interface IRejectDoctor extends Document {
  doctorId: mongoose.Types.ObjectId;
  reason: string;
  createdAt: Date;
}

const rejectDoctorSchema: Schema<IRejectDoctor> = new Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const rejectDoctorModel = mongoose.model<IRejectDoctor>(
  "RejectDoctor",
  rejectDoctorSchema
);

export default rejectDoctorModel;
