import request from "supertest";

process.env.PORT = "0";
process.env.NODE_ENV = "development";

import { app } from "../../src/server/Server";

describe("Test server up in dev mode", function () {
  it('responds with 200', function (done) {
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done)
  });
});

