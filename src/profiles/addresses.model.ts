import mongoose from "mongoose";
import { IAddress } from "./common.interface";

const addressSchema = new mongoose.Schema<IAddress>(
  {
    address: {
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
      metadata: String,
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
