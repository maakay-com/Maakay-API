import { IUser } from "../users/users.interface";
import { IAddress } from "./addresses.interface";
import Address from "./addresses.model";

const getAddresses = async (userId: string) => {
  try {
    const addresses = await Address.find({ user: userId });
    return addresses;
  } catch (error) {
    throw error;
  }
};

const createAddress = async (user: IUser, body: IAddress) => {
  try {
    const { accountNumber, token, metadata } = body;

    const address = await Address.create({
      accountNumber,
      token,
      metadata,
      user: user._id,
    });
    return address;
  } catch (error) {
    throw error;
  }
};

export { getAddresses, createAddress };
