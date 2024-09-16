import { Document, model, Schema } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  password: string;
}

const adminSchema = new Schema<IAdmin>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const adminModel = model<IAdmin>("Admin", adminSchema);

export default adminModel;
