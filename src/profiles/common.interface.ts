import { Document } from "mongoose";
import { IUser } from "../users/users.interface";

interface IAddress extends Document {
  address: string;
  metadata: string;
  token: {
    title: string;
    symbol: string;
    logoUrl: string;
    metadata: string;
  };
  user: IUser;
}

export { IAddress };
