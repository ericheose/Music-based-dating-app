import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server-core";

import app from "../app";
import UserModel from "../models/userModel";
import { SignUpBody, LoginBody } from "../controllers/types";
import bcrypt from "bcrypt";

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const connectionString = mongod.getUri();
  await mongoose.connect(connectionString);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// Mock user data
const newUser: SignUpBody = {
  username: "testuser123",
  email: "test123@example.com",
  password: "testpassword",
};

const loginUser: LoginBody = {
  username: "testuser123",
  password: "testpassword",
};

describe("userController", () => {
  beforeEach(async () => {
    const passwordHashed = await bcrypt.hash(newUser.password, 10);
    await UserModel.create({ ...newUser, password: passwordHashed });
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  describe("signUp", () => {
    it("should create a new user", async () => {
      await UserModel.deleteMany({}); // Clear users before creating a new one in this test

      const response = await request(app)
        .post("/api/users/signup")
        .send({
          ...newUser,
          username: "uniqueusername",
          email: "uniqueemail@example.com",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining({ username: "uniqueusername" }));
    });
  });


  describe("login", () => {
    it("should log in the user", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .send(loginUser);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({ username: loginUser.username }));
    });
  });


  describe("signUp", () => {
    it("should not create a user if username is not unique", async () => {
      const response = await request(app)
        .post("/api/users/signup")
        .send(newUser); // Attempt to create a new user with the same username

      expect(response.status).toBe(409);
      expect(response.body).toEqual(expect.objectContaining({ error: "Username already taken. Please choose a different one or log in instead." }));
    });

    it("should not create a user if email is not unique", async () => {
      const response = await request(app)
        .post("/api/users/signup")
        .send({
          ...newUser,
          username: "uniqueusername",
        }); // Attempt to create a new user with the same email

      expect(response.status).toBe(409);
      expect(response.body).toEqual(expect.objectContaining({ error: "A user with this email address already exists. Please log in instead." }));
    });

    it("should not create a user if username is missing", async () => {
      const response = await request(app)
        .post("/api/users/signup")
        .send({
          email: "uniqueemail@example.com",
          password: "testpassword",
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(expect.objectContaining({ error: "Parameters missing" }));
    });

    it("should not create a user if email is missing", async () => {
      const response = await request(app)
        .post("/api/users/signup")
        .send({
          username: "uniqueusername",
          password: "testpassword",
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(expect.objectContaining({ error: "Parameters missing" }));
    });

    it("should not create a user if password is missing", async () => {
      const response = await request(app)
        .post("/api/users/signup")
        .send({
          username: "uniqueusername",
          email: "uniqueemail@example.com",
        });
      expect(response.status).toBe(400);
      expect(response.body).toEqual(expect.objectContaining({ error: "Parameters missing" }));
    });
  });

  describe("login", () => {
    it("should not log in a non-existent user", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .send({
          username: "nonexistentuser",
          password: "randompassword",
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual(expect.objectContaining({ error: "Invalid username" }));
    });

    it("should not log in a user with incorrect password", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .send({
          username: loginUser.username,
          password: "incorrectpassword",
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual(expect.objectContaining({ error: "Invalid password" }));
    });
    it("should not log in a user if username is missing", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .send({
          password: "testpassword",
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(expect.objectContaining({ error: "Parameters missing" }));
    });

    it("should not log in a user if password is missing", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .send({
          username: "testuser123",
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual(expect.objectContaining({ error: "Parameters missing" }));
    });
  });

  describe('logout', () => {
    it('should log out the user', async () => {
      const loginResponse = await request(app)
        .post('/api/users/login')
        .send(loginUser);

      const token = loginResponse.body.token;

      const response = await request(app)
        .post('/api/users/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User has been logged out.' });
    });
  });
});




