import { Document, Schema, model } from "mongoose";

// Enum for transaction types
enum TransactionType {
  DEBIT = "debit",
  CREDIT = "credit",
}

// Interface for wallet transactions
interface ITransaction {
  amount: number;
  type: TransactionType;
  date: Date;
  description?: string;
}

// Interface for the wallet schema
export interface IWallet extends Document {
  doctorId: string;
  balance: number;
  history: ITransaction[];
  createdAt: Date;
  updatedAt: Date;
}

// Schema for wallet transactions
const transactionSchema = new Schema<ITransaction>({
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(TransactionType),
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
});

// Schema for the wallet
const walletSchema = new Schema<IWallet>(
  {
    doctorId: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      required: true,
    },
    history: {
      type: [transactionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Create the wallet model
const walletModel = model<IWallet>("Wallet", walletSchema);

export default walletModel;
