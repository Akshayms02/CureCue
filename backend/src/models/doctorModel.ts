import mongoose, { Document, model, Schema } from "mongoose";

interface ImageField {
  type: string;
  url: string;
}
export interface IDoctor extends Document {
  doctorId: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  DOB: Date;
  department: mongoose.Types.ObjectId;
  gender: string;
  image: ImageField;
  fees: number;
  kycStatus: KYCStatus;
  kycDetails: {
    certificateImage: ImageField;
    qualificationImage: ImageField;
    adharFrontImage: ImageField;
    adharBackImage: ImageField;
    adharNumber: number;
  };
  createdAt: Date;
  lastLogin: Date;
  isBlocked: boolean;
}

enum KYCStatus {
  PENDING = "pending",
  SUBMITTED = "submitted",
  APPROVED = "approved",
  REJECTED = "rejected",
}

const imageFieldSchema = new Schema<ImageField>({
  type: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

// Define the main Doctor schema
const doctorSchema = new Schema<IDoctor>({
  doctorId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Specialization",
  },
  gender: {
    type: String,
  },
  image: {
    type: imageFieldSchema,
  },
  fees: {
    type: Number,
  },
  kycStatus: {
    type: String,
    enum: Object.values(KYCStatus),
    default: KYCStatus.PENDING,
  },
  kycDetails: {
    certificateImage: {
      type: imageFieldSchema,
    },
    qualificationImage: {
      type: imageFieldSchema,
    },
    adharFrontImage: {
      type: imageFieldSchema,
    },
    adharBackImage: {
      type: imageFieldSchema,
    },
    adharNumber: {
      type: Number,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

const doctorModel = model<IDoctor>("Doctor", doctorSchema);

export default doctorModel;
