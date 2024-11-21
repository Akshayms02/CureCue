import mongoose, { Document, Schema, model } from "mongoose";

interface IAppointment extends Document {
  userId: string;
  doctorId: string;
  patientName: string;
  date: Date;
  start: Date;
  end: Date;
  locked: mongoose.Types.ObjectId | null;
  status:
    | "pending"
    | "prescription pending"
    | "completed"
    | "cancelled"
    | "cancelled by Dr";
  fees: number;
  paymentMethod: "razorpay" | "wallet";
  paymentStatus:
    | "payment pending"
    | "payment completed"
    | "payment failed"
    | "refunded"
    | "anonymous";
  paymentId?: string | null;
  prescription?: string | null;
  review?: {
    rating?: number;
    description?: string;
  };
  reason?: string | null;
  cancelledBy?: "user" | "doctor" | null;
  createdAt?: Date;
  medicalRecords?: string[];
  updatedAt?: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },

    doctorId: {
      type: String,
      ref: "Doctor",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    review: {
      rating: {
        type: Number,
        default: 0,
      },
      description: {
        type: String,
        default: "",
      },
    },
    end: {
      type: Date,
      required: true,
    },
    locked: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "completed",
        "cancelled",
        "prescription pending",
        "cancelled by Doctor",
      ],
      default: "pending",
    },
    fees: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "wallet"],
      default: "razorpay",
    },
    paymentStatus: {
      type: String,
      enum: [
        "payment pending",
        "payment completed",
        "payment failed",
        "refunded",
      ],
      default: "payment pending",
    },
    paymentId: {
      type: String,
      default: null,
    },
    prescription: {
      type: String,
      default: null,
    },
    reason: {
      type: String,
      default: null,
    },
    cancelledBy: {
      type: String,
      enum: ["user", "doctor"],
      default: null,
    },
  },
  { timestamps: true }
);

const appointmentModel = model<IAppointment>("Appointment", AppointmentSchema);

export default appointmentModel;
