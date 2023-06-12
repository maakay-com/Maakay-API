import { getUser, generateJWT } from "../../users/users.service";

const getAuthenticatedUserJWT = async () => {
  const user = await getUser(
    "0x08Dc3835827e7958D5ABAeF12c09b7C128a93DFD",
    "metamask"
  );
  const accessToken = await generateJWT(user, "ACCESS");
  const refreshToken = await generateJWT(user, "REFRESH");

  return { accessToken, refreshToken };
};

const getDeletedUserJWT = async () => {
  const user = await getUser(
    "0x08Dc3835827e7958D5ABAeF12c09b7C128a93DFD",
    "metamask"
  );

  const accessToken = await generateJWT(user, "ACCESS");
  user.deleteOne();
  return accessToken;
};

export { getAuthenticatedUserJWT, getDeletedUserJWT };
