const successMessages = {};

const errorMessages = {
  USERNAME_UNAVAILABLE: "Username is already taken.",
  USER_ACCOUNT_NOT_FOUND: "User account not found.",
  INVALID_JWT_TYPE: "Please use refresh token to generate a new access token.",
  USER_ASSOCIATED_WITH_JWT_NOT_FOUND: "User associated with JWT not found.",
  INVALID_SIGNATURE: "Invalid signature.",
};

export { successMessages, errorMessages };
