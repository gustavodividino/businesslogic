const connection = require("../../database/connection");

module.exports = {
  async index(request, response) {
    let portals = await connection("TB_MM_PORTAL")
      .where({
        type: "I",
      })
      .orderBy([
        { column: "ambiente", order: "asc" },
        { column: "system", order: "asc" },
        { column: "portal", order: "asc" },
      ]);

    return response.json(portals);
  },

  async show(request, response) {
    const { ambiente, system, portal } = request.query;

    if (ambiente != "" && system != "" && portal != "") {
      let portals = await connection("TB_MM_PORTAL").where({
        ambiente: ambiente,
        system: system,
        portal: portal,
      });
      return response.json(portals);
    }

    return response.json([]);
  },

  async recollect(request, response) {
    const { systemportal } = request.query;

    if (systemportal != "|" && systemportal != undefined) {
      let systemportals = await connection("TB_MM_PORTAL").where({
        system: systemportal.split("|")[0],
        portal: systemportal.split("|")[1],
      });

      if (systemportals[0].path != "/") {
        let recollectPortals = await connection("TB_MM_PORTAL").where({
          type: "I",
          path: systemportals[0].path,
        });
        return response.json(recollectPortals);
      }
    }

    return response.json([]);
  },

  async findByBusinesslogic(request, response) {
    const { ambiente, businesslogic } = request.query;

    if (ambiente != "" && businesslogic != "") {
      let portals = await connection("TB_MM_PORTAL").where({
        ambiente: ambiente,
        businesslogic: businesslogic
      });
      return response.json(portals);
    }

    return response.json([]);
  },
};
