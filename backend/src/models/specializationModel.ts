import { Document, model, Schema } from "mongoose";

export interface ISpecialization extends Document {
  name: string;
  description: string;
  createdAt: Date;
  isListed: boolean;
}

const specializationSchema = new Schema<ISpecialization>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isListed: {
    type: Boolean,
    default: true,
  },
});

const specializationModel = model<ISpecialization>(
  "Specialization",
  specializationSchema
);

export default specializationModel;
