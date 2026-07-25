import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js"; // see note below

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("Auth rules", () => {
  test("GET /api/leads without token returns 401", async () => {
    const res = await request(app).get("/api/leads");
    expect(res.statusCode).toBe(401);
  });

  test("Admin login with wrong password returns 401", async () => {
    const res = await request(app)
      .post("/api/auth/admin-login")
      .send({ username: "admin", password: "wrongpass" });
    expect(res.statusCode).toBe(401);
  });

  test("Admin login with correct credentials returns token", async () => {
    const res = await request(app)
      .post("/api/auth/admin-login")
      .send({ username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});

describe("Core flows", () => {
  test("POST /api/leads creates a new lead", async () => {
    const res = await request(app).post("/api/leads").send({
      firstName: "Test",
      lastName: "User",
      company: "Acme",
      phone: "1234567890",
      email: "test@acme.com",
      message: "Testing",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.lead).toBeDefined();
  });

  test("Admin can assign a lead", async () => {
    const login = await request(app)
      .post("/api/auth/admin-login")
      .send({ username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD });
    const token = login.body.token;

    const leadRes = await request(app).post("/api/leads").send({
      firstName: "A", lastName: "B", company: "C", phone: "1234567890",
      email: "a@b.com", message: "hi",
    });
    const leadId = leadRes.body.lead._id;

    const assignRes = await request(app)
      .patch(`/api/leads/${leadId}/assign`)
      .set("Authorization", `Bearer ${token}`)
      .send({ assignedTo: "Member 1" });

    expect(assignRes.statusCode).toBe(200);
    expect(assignRes.body.lead.assignedTo).toBe("Member 1");
  });
});