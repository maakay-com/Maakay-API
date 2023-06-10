import mongoose from "mongoose";
import { IAddress } from "./addresses.interface";

const addressSchema = new mongoose.Schema<IAddress>(
  {
    accountNumber: {
      type: String,
      required: true,
      minLength: 24,
      maxLength: 128,
    },
    metadata: String,
    token: {
      title: String,
      symbol: String,
      logoUrl: String,
      requiresMetadata: Boolean,
      tokenInfoUrl: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model<IAddress>("Address", addressSchema);
export default Address;
