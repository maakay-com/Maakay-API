import { connect, clear, close } from "../test-db-connect.helper";

import request from "supertest";
import app from "../../../index";

import Web3 from "web3";

import { errorMessages } from "../../common/config/messages";
import { getUser, generateJWT } from "../../users/users.service";

beforeAll(async () => {
  await connect();
});
beforeEach(async () => {
  await clear();
});
afterAll(async () => await close());

describe("POST /api/v1/users/nonce", () => {
  it("should return 400 if accountNumber is not provided", async () => {
    const res = await request(app).post("/api/v1/users/nonce").send({
      provider: "metamask",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: "accountNumber",
            location: "body",
          }),
        ]),
      })
    );
  });

  it("should return 200 and nonce", async () => {
    const res = await request(app).post("/api/v1/users/nonce").send({
      accountNumber: "0x1234567890123456789012345678901234567890",
      provider: "metamask",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("nonce");
  });
});

describe("POST /api/v1/users/create-jwt", () => {
  it("should return 400 if accountNumber is not provided", async () => {
    const res = await request(app).post("/api/v1/users/create-jwt").send({
      provider: "metamask",
      signature: "signature",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: "accountNumber",
            location: "body",
          }),
        ]),
      })
    );
  });

  it("should return 400 if provider is not provided", async () => {
    const res = await request(app).post("/api/v1/users/create-jwt").send({
      accountNumber: "accountNumber",
      signature: "signature",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: "provider",
            location: "body",
          }),
        ]),
      })
    );
  });

  it("should return 400 if signature is not provided", async () => {
    const res = await request(app).post("/api/v1/users/create-jwt").send({
      provider: "metamask",
      accountNumber: "accountNumber",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: "signature",
            location: "body",
          }),
        ]),
      })
    );
  });

  it("should return 404 if user account is not found", async () => {
    const res = await request(app).post("/api/v1/users/create-jwt").send({
      accountNumber: "0x08Dc3835827e7958D5ABAeF12c09b7C128a93DFD",
      provider: "metamask",
      signature:
        "0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a0291c",
    });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toEqual(
      expect.objectContaining({
        message: errorMessages.USER_ACCOUNT_NOT_FOUND,
      })
    );
  });

  it("should return 401 if signature is invalid", async () => {
    const user = await getUser(
      "0x08Dc3835827e7958D5ABAeF12c09b7C128a93DFD",
      "metamask"
    );

    const res = await request(app).post("/api/v1/users/create-jwt").send({
      accountNumber: user.accountNumber,
      provider: user.provider,
      signature:
        "0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a0291c",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toEqual(
      expect.objectContaining({
        message: errorMessages.INVALID_SIGNATURE,
      })
    );
  });

  it("should return 500 if signature is not of correct format", async () => {
    const user = await getUser(
      "0x08Dc3835827e7958D5ABAeF12c09b7C128a93DFD",
      "metamask"
    );

    const res = await request(app).post("/api/v1/users/create-jwt").send({
      accountNumber: user.accountNumber,
      provider: user.provider,
      signature: "signature of invalid format",
    });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 200 and jwt tokens if signature is valid.", async () => {
    const user = await getUser(
      "0x08Dc3835827e7958D5ABAeF12c09b7C128a93DFD",
      "metamask"
    );

    const web3 = new Web3();
    const signatureObject = web3.eth.accounts.sign(
      user.nonce.toString(),
      "72f1c939a30d85199cca8d4bcba6ae639a409343a032c234d3a7ca21c9aad6a9"!
    );

    const res = await request(app).post("/api/v1/users/create-jwt").send({
      accountNumber: user.accountNumber,
      provider: user.provider,
      signature: signatureObject.signature,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });
});

describe("POST /api/v1/users/refresh-jwt", () => {
  it("should return 400 if refreshToken is not provided", async () => {
    const res = await request(app).post("/api/v1/users/refresh-jwt").send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: "refreshToken",
            location: "body",
          }),
        ]),
      })
    );
  });

  it("should return 401 if refreshToken is invalid", async () => {
    const res = await request(app).post("/api/v1/users/refresh-jwt").send({
      refreshToken: "invalid refresh token",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 401 if accessToken is used to request new accessToken", async () => {
    const user = await getUser(
      "0x08Dc3835827e7958D5ABAeF12c09b7C128a93DFD",
      "metamask"
    );
    const accessToken = await generateJWT(user, "ACCESS");

    const res = await request(app).post("/api/v1/users/refresh-jwt").send({
      refreshToken: accessToken,
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toEqual(
      expect.objectContaining({
        message: errorMessages.INVALID_JWT_TYPE,
      })
    );
  });

  it("should return 200 and new accessToken if refreshToken is valid", async () => {
    const user = await getUser(
      "0x08Dc3835827e7958D5ABAeF12c09b7C128a93DFD",
      "metamask"
    );
    const refreshToken = await generateJWT(user, "REFRESH");

    const res = await request(app).post("/api/v1/users/refresh-jwt").send({
      refreshToken,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });
});
