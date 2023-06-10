const successMessages = {};

const errorMessages = {
  USERNAME_UNAVAILABLE: "Username is already taken.",
  USER_ACCOUNT_NOT_FOUND: "User account not found.",
  INVALID_JWT_TYPE: "Invalid token type used.",
  USER_ASSOCIATED_WITH_JWT_NOT_FOUND: "User associated with JWT not found.",
  INVALID_SIGNATURE: "Invalid signature.",
  TOKEN_NOT_SUPPORTED: "Token is not supported.",
  METADATA_REQUIRED: "Metadata is required for this token.",
  ACCOUNT_NUMBER_NOT_VALID_FOR_TOKEN: "Account number is not valid for token.",
};

export { successMessages, errorMessages };
