const request = require("supertest");

const app = require("../src/app");

describe("GETs", () => {
  it("Retorno da lista de Portais", async () => {
    const response = await request(app).get("/portal");

    expect(response.statusCode).toEqual(200);

    expect(response.body[0]).toHaveProperty("ambiente");
    expect(response.body[0]).toHaveProperty("system");
    expect(response.body[0]).toHaveProperty("portal");
    expect(response.body[0]).toHaveProperty("type");
    expect(response.body[0]).toHaveProperty("businesslogic");
    expect(response.body[0]).toHaveProperty("path");
    expect(response.body[0]).toHaveProperty("server");
    expect(response.body[0]).toHaveProperty("script");
    expect(response.body[0]).toHaveProperty("recollect");
  });

  it("Filtrar por portal especifico ", async () => {
    const response = await request(app).get(
      "/portal/filter?ambiente=FIX-PROC&system=TRK_REC&portal=IM1_LDX"
    );

    expect(response.statusCode).toEqual(200);

    expect(response.body[0]).toHaveProperty("ambiente");
    expect(response.body[0]).toHaveProperty("system");
    expect(response.body[0]).toHaveProperty("portal");
    expect(response.body[0]).toHaveProperty("type");
    expect(response.body[0]).toHaveProperty("businesslogic");
    expect(response.body[0]).toHaveProperty("path");
    expect(response.body[0]).toHaveProperty("server");
    expect(response.body[0]).toHaveProperty("script");
    expect(response.body[0]).toHaveProperty("recollect");
  });

  it("Retorno de Recoletas ", async () => {
    const response = await request(app).get(
      "/portal/recollect?systemportal=F_FIS_O%7CBAERIG1"
    );

    expect(response.statusCode).toEqual(200);

    expect(response.body[0]).toHaveProperty("ambiente");
    expect(response.body[0]).toHaveProperty("system");
    expect(response.body[0]).toHaveProperty("portal");
    expect(response.body[0]).toHaveProperty("type");
    expect(response.body[0]).toHaveProperty("businesslogic");
    expect(response.body[0]).toHaveProperty("path");
    expect(response.body[0]).toHaveProperty("server");
    expect(response.body[0]).toHaveProperty("script");
    expect(response.body[0]).toHaveProperty("recollect");
  });
});
