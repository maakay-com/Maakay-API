import { IUser } from "../users/users.interface";
import { IAddress } from "./addresses.interface";
import Address from "./addresses.model";
import { errorMessages } from "../common/config/messages";
import { CustomError } from "../common/interfaces/common";

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

    const addressExists = await Address.findOne({
      accountNumber,
      "token.symbol": token.symbol,
      user: user._id,
    });

    if (addressExists) {
      throw new CustomError(
        errorMessages.ACCCOUNT_NUMBER_FOR_TOKEN_ALREADY_EXISTS,
        409
      );
    }

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

const updateAddress = async (
  addressId: string,
  user: IUser,
  body: IAddress
) => {
  try {
    const { accountNumber, token, metadata } = body;

    const address = await Address.findById(addressId);
    if (!address) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    if (user._id.toString() != address.user._id.toString()) {
      throw new CustomError(errorMessages.USER_NOT_AUTHORIZED, 401);
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      {
        accountNumber,
        token,
        metadata,
        user: user._id,
      },
      { new: true }
    );
    return updatedAddress;
  } catch (error) {
    throw error;
  }
};

const deleteAddress = async (addressId: string, user: IUser) => {
  try {
    const address = await Address.findById(addressId);
    if (!address) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    if (user._id.toString() != address.user._id.toString()) {
      throw new CustomError(errorMessages.USER_NOT_AUTHORIZED, 401);
    }

    const deletedAddress = await Address.findOneAndDelete({ _id: addressId });
    return deletedAddress;
  } catch (error) {
    throw error;
  }
};

export { getAddresses, createAddress, updateAddress, deleteAddress };
