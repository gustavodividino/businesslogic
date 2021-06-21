const request = require("supertest");

const app = require("../src/app");

describe("GETs", () => {
  it("Retorno das informacoes de uma Operacao", async () => {
    const response = await request(app).get("/operation/filter?ambiente=BAT1&operation=PROC246_V01");

    expect(response.statusCode).toEqual(200);
    
    expect(response.body[0]).toHaveProperty("ambiente");
    expect(response.body[0]).toHaveProperty("operation");
    expect(response.body[0]).toHaveProperty("description");
    expect(response.body[0]).toHaveProperty("script");
    expect(response.body[0]).toHaveProperty("scriptDescription");

  });
});
