import express from "express";
const router = express.Router();

import { getUserNonce, createJWT, refreshJWT } from "./users.controller";
import {
  getUserNonceSchema,
  refreshJWTSchema,
  createJWTSchema,
} from "./users.schema";
import { validateRequest } from "../common/middlewares/validator";

router.post("/nonce", getUserNonceSchema, validateRequest, getUserNonce);
router.post("/create-jwt", createJWTSchema, validateRequest, createJWT);
router.post("/refresh-jwt", refreshJWTSchema, validateRequest, refreshJWT);

export default router;
