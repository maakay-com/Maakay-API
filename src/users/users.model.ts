import mongoose from "mongoose";
import { generateNonce } from "../common/utils/common";
import { IUser } from "./users.interface";

const userSchema = new mongoose.Schema<IUser>(
  {
    accountNumber: {
      type: String,
      required: true,
      minLength: 32,
      maxLength: 128,
    },
    provider: {
      type: String,
      required: true,
      enum: ["metamask"],
    },
    nonce: {
      type: Number,
      default: generateNonce(),
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("Profile", userSchema);
export default User;
