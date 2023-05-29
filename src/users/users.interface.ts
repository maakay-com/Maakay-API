import { Document } from "mongoose";

import { JwtPayload } from "jsonwebtoken";

interface IUser extends Document {
  accountNumber: string;
  provider: string;
  nonce: number;
}

interface IAuthJwtPayload extends JwtPayload {
  _id: string;
  accountNumber: string;
  provider: string;
  type: string;
}

type JWTGrantType = "ACCESS" | "REFRESH";

export { IUser, JWTGrantType, IAuthJwtPayload };
