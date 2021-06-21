const request = require("supertest");

const app = require("../src/app");

describe("GETs", () => {
  it("Retorno do array de Ambientes", async () => {
    const response = await request(app).get("/ambiente");

    expect(response.statusCode).toEqual(200);
    
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
  });
});
