const request = require("supertest");

const app = require("../src/app");

describe("GETs", () => {
  it("Retorno da lista de businesslogic", async () => {
    const response = await request(app).get("/businesslogic");

    expect(response.statusCode).toEqual(200);

    expect(response.body[0]).toHaveProperty("ambiente");
    expect(response.body[0]).toHaveProperty("businesslogic");
    expect(response.body[0]).toHaveProperty("status");
    expect(response.body[0]).toHaveProperty("description");
  });

  it("Criação do MindMap ", async () => {
    const response = await request(app).get(
      "/createbusinesslogic?businessLogic=DCDM2M3&ambiente=ON-SP"
    );

    expect(response.statusCode).toEqual(200);

    for (i = 0; i < response.body.lenght; i++) {
      if (response.body[i].type == "input") {
        expect(response.body[i]).toHaveProperty("id");
        expect(response.body[i]).toHaveProperty("sourcePosition");
        expect(response.body[i]).toHaveProperty("targetPosition");
        expect(response.body[i]).toHaveProperty("type");
        expect(response.body[i]).toHaveProperty("className");
        expect(response.body[i]).toHaveProperty("data.label");
        expect(response.body[i]).toHaveProperty("position.x");
        expect(response.body[i]).toHaveProperty("position.y");
        expect(response.body[i]).toHaveProperty("draggable");
        expect(response.body[i]).toHaveProperty("style.background");
        expect(response.body[i]).toHaveProperty("style.color");
        expect(response.body[i]).toHaveProperty("style.border");
        expect(response.body[i]).toHaveProperty("style.width");
      } else if (response.body[i].type == "step") {
        expect(response.body[i]).toHaveProperty("id");
        expect(response.body[i]).toHaveProperty("type");
        expect(response.body[i]).toHaveProperty("source");
        expect(response.body[i]).toHaveProperty("target");
        expect(response.body[i]).toHaveProperty("label");
        expect(response.body[i]).toHaveProperty("labelBgPadding");
        expect(response.body[i]).toHaveProperty("labelBgBorderRadius");
        expect(response.body[i]).toHaveProperty("labelBgStyle.fill");
        expect(response.body[i]).toHaveProperty("labelBgStyle.color");
        expect(response.body[i]).toHaveProperty("labelBgStyle.fillOpacity");
        expect(response.body[i]).toHaveProperty("arrowHeadType");
        expect(response.body[i]).toHaveProperty("animated");
      }
    }
  });
});
