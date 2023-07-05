import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import UserModel from '../models/userModel';
import MatchModel from '../models/matchModel';

let mongod: MongoMemoryServer;
let agent: request.SuperAgentTest;
let sessionCookie: string;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const connectionString = mongod.getUri();
  await mongoose.connect(connectionString);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await MatchModel.deleteMany({});
  await UserModel.deleteMany({});
  agent = request.agent(app); // Create an agent to persist session cookies
});

describe('Match API', () => {
  describe('GET /api/match', () => {
    beforeEach(async () => {
      // Signup user
      await agent
        .post('/api/users/signup')
        .send({
          username: 'testuser123',
          email: 'test123@example.com',
          password: 'testpassword',
        });
    });

    it('returns all matches', async () => {
      // Login user and obtain session cookie
      const loginResponse = await agent
        .post('/api/users/login')
        .send({
          username: 'testuser123',
          password: 'testpassword',
        });

      expect(loginResponse.status).toBe(200);
      sessionCookie = loginResponse.headers['set-cookie'][0];

      // Find user1
      const user1 = await UserModel.findOne({ username: 'testuser123' });
      if (!user1) {
        throw new Error('User not found');
      }

      // Create user2 and match data
      const user2 = await UserModel.create({
        username: 'user2',
        email: 'user2@example.com',
        password: 'password2',
      });

      const matchData = {
        user: user1.username,
        userId: user1._id,
        matchedWith: user2.username,
        matchedWithId: user2._id,
        sharedMusic: {
          sharedsongs: ['song1', 'song2'],
          sharedalbums: ['album1', 'album2'],
          sharedgenres: ['genre1', 'genre2'],
          sharedartists: ['artist1', 'artist2'],
        },
        messages: [
          {
            messageBody: 'Hello!',
            senderid: user1._id,
            date: new Date(),
          },
        ],
        lastMessage: 'Hello!',
        lastMessageDate: new Date(),
      };

      await MatchModel.create(matchData);

      // Use the obtained session cookie for subsequent requests
      const response = await agent
        .get('/api/match')
        .set('Cookie', sessionCookie);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      // Add your assertions for the match data here
    });
  });
});

