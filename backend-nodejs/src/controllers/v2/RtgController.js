const connection = require("../../database/connection");

module.exports = {
  async index(request, response) {
    let rtg = await connection("TB_RTG").orderBy([
      { column: "ambiente", order: "asc" },
    ]);

    return response.json(rtg);
  },

  async show(request, response) {
    const { businesslogic, ambiente } = request.query;

    let rtg = await connection("TB_RTG").where({
      ambiente: ambiente,
      businesslogic: businesslogic,
    });

    return response.json(rtg);
  },
};
