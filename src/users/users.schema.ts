import { body } from "express-validator";

const getUserNonceSchema = [
  body("accountNumber").isString().notEmpty(),
  body("provider").isString().notEmpty(),
];

const createJWTSchema = [
  body("accountNumber").isString().notEmpty(),
  body("provider").isString().notEmpty(),
  body("signature").isString().notEmpty(),
];

const refreshJWTSchema = [body("refreshToken").exists()];

export { getUserNonceSchema, refreshJWTSchema, createJWTSchema };
