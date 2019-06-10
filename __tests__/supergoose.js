/**
 * Combines SuperTest and Mongoose Memory Server
 * to reduce (hopefully) the pain of
 * testing a Mongoose API
 */

const mongoose = require("mongoose");
const MongoMemoryServer = require("mongodb-memory-server").default;
const supertest = require("supertest");

let mongoServer;

let supergoose = (module.exports = {});
/**
 * @server
 * @returns function that expects an express server
 */
supergoose.server = server => supertest(server);

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

/**
 * Typically used in Jest beforeAll hook
 */
supergoose.startDB = async () => {
  mongoServer = new MongoMemoryServer();

  const mongoUri = await mongoServer.getConnectionString();

  const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true
  };

  await mongoose.connect(mongoUri, mongooseOptions);
};

/**
 * Typically used in Jest afterAll hook
 */
supergoose.stopDB = async () => {
  await mongoose.disconnect();
  mongoServer.stop();
};

if (!module.parent) {
  // Just so that it can live in the tests folder
  describe("supergoose", () => {
    it("is super", () => {
      expect(true).toBeTruthy();
    });
  });
}
