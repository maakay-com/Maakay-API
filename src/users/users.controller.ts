import { NextFunction, Response, Request } from "express";
import {
  getUser,
  verifySignature,
  generateJWT,
  verifyRefreshJWT,
  rotateUserNonce,
} from "./users.service";

const getUserNonce = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accountNumber, provider } = req.body;
    const user = await getUser(accountNumber, provider);
    const nonce = user.nonce;
    res.status(200).json({ nonce: nonce });
  } catch (error) {
    next(error);
  }
};

const createJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accountNumber, provider, signature } = req.body;
    const user = await verifySignature(accountNumber, provider, signature);

    const accessToken = await generateJWT(user, "ACCESS");
    const refreshToken = await generateJWT(user, "REFRESH");

    rotateUserNonce(user);

    res.status(200).json({ accessToken, refreshToken });
  } catch (error: any) {
    next(error);
  }
};

const refreshJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    const payload = await verifyRefreshJWT(refreshToken);

    const user = await getUser(payload.accountNumber, payload.provider);
    const accessToken = await generateJWT(user, "ACCESS");

    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export { getUserNonce, createJWT, refreshJWT };
