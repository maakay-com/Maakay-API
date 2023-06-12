import { Document } from "mongoose";
import { IUser } from "../users/users.interface";

interface IAddress extends Document {
  accountNumber: string;
  metadata: string;
  token: {
    title: string;
    symbol: string;
    logoUrl: string;
    requiresMetadata: boolean;
    tokenInfoUrl: string;
  };
  user: IUser;
}

export { IAddress };
