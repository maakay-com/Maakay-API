import { connect, clear, close } from "../test-db-connect.helper";

import request from "supertest";
import app from "../../../index";

import Web3 from "web3";

import { errorMessages } from "../../common/config/messages";
import { getUser, generateJWT } from "../../users/users.service";
import { getDeletedUserJWT, getAuthenticatedUserJWT } from "./users.helper";
import { seedUserAddress } from "./addresses.helper";

beforeAll(async () => {
  await connect();
});
beforeEach(async () => {
  await clear();
});
afterAll(async () => await close());

describe("GET /api/v1/addresses", () => {
  it("should return 401 if authorization header is not provided", async () => {
    const res = await request(app).get("/api/v1/addresses");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 401 if authorization header is invalid", async () => {
    const res = await request(app)
      .get("/api/v1/addresses")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer invalidJWTToken`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 404 if user associated with jwt is not found", async () => {
    const accessToken = await getDeletedUserJWT();
    const res = await request(app)
      .get("/api/v1/addresses")
      .set({
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toEqual(
      expect.objectContaining({
        message: errorMessages.USER_ASSOCIATED_WITH_JWT_NOT_FOUND,
      })
    );
  });

  it("should return 401 if jwt type is not ACCESS", async () => {
    const { refreshToken } = await getAuthenticatedUserJWT();
    const res = await request(app)
      .get("/api/v1/addresses")
      .set({
        Accept: "application/json",
        Authorization: `Bearer ${refreshToken}`,
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toEqual(
      expect.objectContaining({
        message: errorMessages.INVALID_JWT_TYPE,
      })
    );
  });

  it("should return 200 and addresses", async () => {
    const user = await getUser(
      "0x08Dc3835827e7958D5ABAeF12c09b7C128a93DFD",
      "metamask"
    );
    const accessToken = await generateJWT(user, "ACCESS");

    await seedUserAddress(user._id);

    const res = await request(app)
      .get("/api/v1/addresses")
      .set({
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          __v: 0,
          _id: expect.any(String),
          accountNumber: expect.any(String),
          token: expect.objectContaining({
            title: expect.any(String),
            symbol: expect.any(String),
            logoUrl: expect.any(String),
            requiresMetadata: expect.any(Boolean),
            tokenInfoUrl: expect.any(String),
          }),
          metadata: expect.any(String),
          user: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ])
    );
  });
});

describe("POST /api/v1/addresses", () => {
  it("should return 401 if authorization header is not provided", async () => {
    const res = await request(app).post("/api/v1/addresses");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 401 if authorization header is invalid", async () => {
    const res = await request(app)
      .post("/api/v1/addresses")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer invalidJWTToken`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 404 if user associated with jwt is not found", async () => {
    const accessToken = await getDeletedUserJWT();
    const res = await request(app)
      .post("/api/v1/addresses")
      .set({
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toEqual(
      expect.objectContaining({
        message: errorMessages.USER_ASSOCIATED_WITH_JWT_NOT_FOUND,
      })
    );
  });

  it("should return 400 if accountNumber or token.symbol is not provided", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();
    const res = await request(app)
      .post("/api/v1/addresses")
      .set({
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
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
          expect.objectContaining({
            path: "token",
            location: "body",
          }),
          expect.objectContaining({
            path: "token.symbol",
            location: "body",
          }),
        ]),
      })
    );
  });

  it("should return 400 if token is not supported", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();
    const res = await request(app)
      .post("/api/v1/addresses")
      .send({
        accountNumber: "0x08Dc3835827e7958D5ABAeF12c09b7C128a93DFD",
        token: {
          symbol: "invalidToken",
        },
      })
      .set({
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: "token.symbol",
            location: "body",
            msg: errorMessages.TOKEN_NOT_SUPPORTED,
          }),
        ]),
      })
    );
  });

  it("should return 400 if token requires metadata and metadata is not provided", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();
    const res = await request(app)
      .post("/api/v1/addresses")
      .send({
        accountNumber:
          "GATUWUJ2HGOCMGGVSZKBMVEREZTVKT56YC7VPJCIBQC3LXYW2MXJBWD2",
        token: {
          symbol: "xlm",
        },
      })
      .set({
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: "metadata",
            location: "body",
          }),
        ]),
      })
    );
  });

  it("should return 400 if accountNumber is not valid for token", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();
    const res = await request(app)
      .post("/api/v1/addresses")
      .send({
        accountNumber: "0x08Dc3835827e7958D5ABAeF12c09b7C128a93DFD",
        token: {
          symbol: "BTC",
        },
      })
      .set({
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: "accountNumber",
            location: "body",
            msg: errorMessages.ACCOUNT_NUMBER_NOT_VALID_FOR_TOKEN,
          }),
        ]),
      })
    );
  });

  it("should return 409 if accountNumber is already registered", async () => {});

  it("should return 201 and address", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .post("/api/v1/addresses")
      .send({
        accountNumber: "3ExEQtSxPTQuzpRfqSGEsBJM8FxuswmqLU",
        token: {
          symbol: "btc",
        },
        metadata: "test",
      })
      .set({
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("accountNumber");
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
  });
});
