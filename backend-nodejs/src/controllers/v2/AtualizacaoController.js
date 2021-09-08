const connection = require("../../database/connection");

module.exports = {
  async index(request, response) {
    
    let update = await connection("TB_MM_UPDATE").orderBy([
        { column: "tableName", order: "asc" }
      ]);

    return response.json(update);
  },
};
