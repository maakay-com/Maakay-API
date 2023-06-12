import { body, oneOf } from "express-validator";
import { tokenData } from "../common/data";
import { errorMessages } from "../common/config/messages";
import WAValidator from "multicoin-address-validator";

const addressSchema = [
  body("accountNumber")
    .isString()
    .notEmpty()
    .custom((value, { req }) => {
      const { token } = req.body;

      const isValidAddress = WAValidator.validate(value, token.symbol);
      if (!isValidAddress) {
        throw new Error(errorMessages.ACCOUNT_NUMBER_NOT_VALID_FOR_TOKEN);
      }

      return true;
    }),
  body("token").isObject(),
  body("token.symbol")
    .isString()
    .notEmpty()
    .custom((value, { req }) => {
      const token = tokenData.find((token) => token.symbol === value);
      if (!token) {
        throw new Error(errorMessages.TOKEN_NOT_SUPPORTED);
      }

      req.body.token.title = token.title;
      req.body.token.logoUrl = token.logoUrl;
      req.body.token.requiresMetadata = token.requiresMetadata;
      req.body.token.tokenInfoUrl = token.tokenInfoUrl;

      return true;
    }),
  body("metadata").custom((value, { req }) => {
    if (req.body.token.requiresMetadata && !value && typeof value != "string") {
      throw new Error(errorMessages.METADATA_REQUIRED);
    }

    return true;
  }),
];

export { addressSchema };
