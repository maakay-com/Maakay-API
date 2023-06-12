import { connect, clear, close } from "../test-db-connect.helper";

import request from "supertest";
import app from "../../../index";

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

  it("should return 401 if user associated with jwt is not found", async () => {
    const accessToken = await getDeletedUserJWT();
    const res = await request(app)
      .get("/api/v1/addresses")
      .set({
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(401);
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

  it("should return 401 if user associated with jwt is not found", async () => {
    const accessToken = await getDeletedUserJWT();
    const res = await request(app)
      .post("/api/v1/addresses")
      .set({
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(401);
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
          symbol: "btc",
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

  it("should return 409 if accountNumber is already registered", async () => {
    const user = await getUser(
      "0x08Dc3835827e7958D5ABAeF12c09b7C128a93DFD",
      "metamask"
    );
    const accessToken = await generateJWT(user, "ACCESS");

    await seedUserAddress(user._id);

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

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toEqual(
      expect.objectContaining({
        message: errorMessages.ACCCOUNT_NUMBER_FOR_TOKEN_ALREADY_EXISTS,
      })
    );
  });

  it("should return 201 and address", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .post("/api/v1/addresses")
      .send({
        accountNumber: "3ExEQtSxPTQuzpRfqSGEsBJM8FxuswmqLU",
        token: {
          symbol: "btc",
        },
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

describe("PUT /api/v1/addresses/:id", () => {
  it("should return 400 if accountNumber does not exists", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .put("/api/v1/addresses/63b26312f2903f1a5b022546")
      .send({
        token: {
          symbol: "btc",
        },
        metadata: "test",
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
          }),
        ]),
      })
    );
  });

  it("should return 400 if token symbol is not provided", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .put("/api/v1/addresses/63b26312f2903f1a5b022546")
      .send({
        accountNumber: "3ExEQtSxPTQuzpRfqSGEsBJM8FxuswmqLU",
        token: {},
        metadata: "test",
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
          }),
        ]),
      })
    );
  });

  it("should return 400 if accountNumber is not valid for token", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();
    const res = await request(app)
      .put("/api/v1/addresses/63b26312f2903f1a5b022546")
      .send({
        accountNumber: "0x08Dc3835827e7958D5ABAeF12c09b7C128a93DFD",
        token: {
          symbol: "btc",
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

  it("should return 404 if addresss does not exists", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .put("/api/v1/addresses/63b26312f2903f1a5b022546")
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

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toEqual(
      expect.objectContaining({
        message: errorMessages.OBJECT_WITH_ID_NOT_FOUND,
      })
    );
  });

  it("should return 401 if user is not owner of address", async () => {
    const user = await getUser(
      "0x08Dc3835827e7958D5ABAeF12c09b7C128a93DFD",
      "metamask"
    );
    const addresses = await seedUserAddress(user._id);

    const secondUser = await getUser(
      "0x08Dc3835827e7958D5ABAeF12c09b7C128a93DFD",
      "phantom"
    );
    const accessToken = await generateJWT(secondUser, "ACCESS");

    const res = await request(app)
      .put(`/api/v1/addresses/${addresses[0]._id.toString()}`)
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

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toEqual(
      expect.objectContaining({
        message: errorMessages.USER_NOT_AUTHORIZED,
      })
    );
  });

  it("should return 200 when address is updated", async () => {
    const user = await getUser(
      "0x08Dc3835827e7958D5ABAeF12c09b7C128a93DFD",
      "metamask"
    );
    const addresses = await seedUserAddress(user._id);
    const accessToken = await generateJWT(user, "ACCESS");

    expect(addresses[0].token.symbol).toBe("eth");

    const res = await request(app)
      .put(`/api/v1/addresses/${addresses[0]._id.toString()}`)
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

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accountNumber");
    expect(res.body).toHaveProperty("token");
    expect(res.body.token).toHaveProperty("symbol");
    expect(res.body.token.symbol).toBe("btc");
  });
});

describe("DELETE /api/v1/addresses/:id", () => {
  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).delete(
      "/api/v1/addresses/63b26312f2903f1a5b022546"
    );

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 404 if address does not exists", async () => {
    const { accessToken } = await getAuthenticatedUserJWT();

    const res = await request(app)
      .delete("/api/v1/addresses/63b26312f2903f1a5b022546")
      .set({
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toEqual(
      expect.objectContaining({
        message: errorMessages.OBJECT_WITH_ID_NOT_FOUND,
      })
    );
  });

  it("should return 401 if user is not owner of address", async () => {
    const user = await getUser(
      "0x08Dc3835827e7958D5ABAeF12c09b7C128a93DFD",
      "metamask"
    );
    const addresses = await seedUserAddress(user._id);

    const secondUser = await getUser(
      "0x08Dc3835827e7958D5ABAeF12c09b7C128a93DFD",
      "phantom"
    );

    const accessToken = await generateJWT(secondUser, "ACCESS");

    const res = await request(app)
      .delete(`/api/v1/addresses/${addresses[0]._id.toString()}`)
      .set({
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toEqual(
      expect.objectContaining({
        message: errorMessages.USER_NOT_AUTHORIZED,
      })
    );
  });

  it("should return 200 when address is deleted", async () => {
    const user = await getUser(
      "0x08Dc3835827e7958D5ABAeF12c09b7C128a93DFD",
      "metamask"
    );
    const accessToken = await generateJWT(user, "ACCESS");

    const addresses = await seedUserAddress(user._id);

    const res = await request(app)
      .delete(`/api/v1/addresses/${addresses[0]._id.toString()}`)
      .set({
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id");
  });
});
