import request from "supertest";

process.env.PORT = "0";
process.env.NODE_ENV = "development";

// import { server, wss } from "../../src/server/Server";
import { app } from "../../src/server/Server";

const agent = request.agent(app);

describe("Test server up in dev mode", function () {
  it('responds with 200', function (done) {
    agent
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done)
  });
});
