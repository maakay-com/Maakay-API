import { NextFunction, Response, Request } from "express";

import { getAddresses, createAddress } from "./addresses.service";
import { AuthenticatedRequest } from "../common/interfaces/common";

const getAll = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const addresses = await getAddresses(req.user?._id);
    res.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
};

const create = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const address = await createAddress(user, req.body);
    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response) => {};
const remove = async (req: Request, res: Response) => {};

export { getAll, create, update, remove };
