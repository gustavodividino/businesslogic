const request = require("supertest");

const app = require("../src/app");

describe("GETs", () => {
  it("Retorno da lista de Portais", async () => {
    const response = await request(app).get("/rtg");

    expect(response.statusCode).toEqual(200);

    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("ambiente");
    expect(response.body[0]).toHaveProperty("businesslogic");
    expect(response.body[0]).toHaveProperty("operator");
    expect(response.body[0]).toHaveProperty("nameOutput");
    expect(response.body[0]).toHaveProperty("nextLevel");
    expect(response.body[0]).toHaveProperty("type");
    expect(response.body[0]).toHaveProperty("recollect");
  });

  it("Filtrar por um Businesslogic especifico ", async () => {
    const response = await request(app).get(
      "/rtg/filter?ambiente=BAT1&businesslogic=RESPSP4"
    );

    expect(response.statusCode).toEqual(200);

    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("ambiente");
    expect(response.body[0]).toHaveProperty("businesslogic");
    expect(response.body[0]).toHaveProperty("operator");
    expect(response.body[0]).toHaveProperty("nameOutput");
    expect(response.body[0]).toHaveProperty("nextLevel");
    expect(response.body[0]).toHaveProperty("type");
    expect(response.body[0]).toHaveProperty("recollect");
  });
});
