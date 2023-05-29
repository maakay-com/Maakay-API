import jwt from "jsonwebtoken";
import Web3 from "web3";

import User from "./users.model";
import { errorMessages } from "../common/config/messages";
import {
  ACCESS_TOKEN_VALIDITY,
  REFRESH_TOKEN_VALIDITY,
} from "../common/config/general";
import { generateNonce } from "../common/utils/common";
import { IUser, JWTGrantType, IAuthJwtPayload } from "./users.interface";

const getUser = async (accountNumber: string, provider: string) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        accountNumber,
        provider,
      },
      {
        accountNumber,
        provider,
      },
      {
        new: true,
        upsert: true,
      }
    );
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const verifySignature = async (
  accountNumber: string,
  provider: string,
  signature: string
): Promise<IUser> => {
  try {
    const user = await User.findOne({
      accountNumber,
      provider,
    });

    if (!user) {
      throw new Error(errorMessages.USER_ACCOUNT_NOT_FOUND);
    }

    const web3 = new Web3();
    const recoveredSigner = web3.eth.accounts.recover(
      `${user.nonce}`,
      signature
    );

    if (recoveredSigner !== accountNumber) {
      throw new Error(errorMessages.INVALID_SIGNATURE);
    }

    return user;
  } catch (error: any) {
    if (error.message == errorMessages.INVALID_SIGNATURE) {
      error.status = 401;
      throw error;
    } else if (error.message == errorMessages.USER_ACCOUNT_NOT_FOUND) {
      error.status = 404;
      throw error;
    }

    throw new Error(error.message);
  }
};

const generateJWT = async (
  user: IUser,
  type: JWTGrantType
): Promise<string> => {
  try {
    let expiresIn: string;
    if (type == "REFRESH") {
      expiresIn = REFRESH_TOKEN_VALIDITY;
    } else {
      expiresIn = ACCESS_TOKEN_VALIDITY;
    }

    const token = jwt.sign(
      {
        _id: user._id,
        accountNumber: user.accountNumber,
        provider: user.provider,
        type,
      },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn,
      }
    );
    return token;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const verifyRefreshJWT = async (
  refreshToken: string
): Promise<IAuthJwtPayload> => {
  try {
    const payload: any = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_KEY as string,
      (err: any, decoded: unknown) => {
        if (err) {
          throw new Error(err.message);
        }
        return decoded;
      }
    );

    if (payload.type != "REFRESH") {
      throw new Error(errorMessages.INVALID_JWT_TYPE);
    }
    return payload;
  } catch (error: any) {
    let jwtError = new Error(error.message);
    jwtError.status = 401;
    throw jwtError;
  }
};

const rotateUserNonce = async (user: IUser) => {
  try {
    user.nonce = generateNonce();
    await user.save();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export {
  getUser,
  verifySignature,
  generateJWT,
  rotateUserNonce,
  generateNonce,
  verifyRefreshJWT,
};
