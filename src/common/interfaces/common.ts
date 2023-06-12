import { IUser } from "../../users/users.interface";
import { Request } from "express";

class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export { AuthenticatedRequest, CustomError };
