import { NextFunction, Response, Request } from "express";

import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "./addresses.service";
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

const update = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const addressId = req.params.id;
    const user = req.user!;
    const updatedAddress = await updateAddress(addressId, user, req.body);
    res.status(200).json(updatedAddress);
  } catch (error) {
    next(error);
  }
};
const remove = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const addressId = req.params.id;
    const user = req.user!;
    const deletedAddress = await deleteAddress(addressId, user);
    res.status(200).json(deletedAddress);
  } catch (error) {
    next(error);
  }
};

export { getAll, create, update, remove };
