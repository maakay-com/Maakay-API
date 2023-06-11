import express from "express";
const router = express.Router();

import { getAll, create, update } from "./addresses.controller";

import { validateRequest } from "../common/middlewares/validator";
import { isAuthorized } from "../common/middlewares/permissions";
import { addressSchema } from "./addresses.schema";

router.get("/", isAuthorized, getAll);
router.post("/", isAuthorized, addressSchema, validateRequest, create);
router.put("/:id", isAuthorized, addressSchema, validateRequest, update);

export default router;
