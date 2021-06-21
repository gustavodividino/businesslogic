const connection = require("../../database/connection");

module.exports = {
  async show(request, response) {

    const { ambiente, operation } = request.query;

    if (ambiente != "" && operation != "") {
      let operations = await connection("TB_OPERATION").where({
        ambiente: ambiente,
        operation: operation,
      });
      return response.json(operations);
    }

    return response.json([]);
    
  },

  async findByScript(request, response) {

    const { script } = request.query;

    if (script != "") {
      let operations = await connection("TB_OPERATION").where({
        script: script,
      });
      return response.json(operations);
    }

    return response.json([]);
    
  },

  async findByAssociationScript(request, response){

    const { ambiente, operation } = request.query;

    let oper = await connection("TB_OPERATION")
    .where({
      ambiente: ambiente,
      operation: operation ,
    })

    const script = oper[0].script;

    if (script != "") {
      let operations = await connection("TB_OPERATION").where({
        "TB_OPERATION.script": script,
      })
      .join('TB_RTG', 'TB_OPERATION.operation', '=', 'TB_RTG.operator')
      .join('TB_PORTAL', 'TB_RTG.businesslogic', '=', 'TB_PORTAL.businesslogic')

      .select('TB_RTG.ambiente','TB_PORTAL.system', 'TB_PORTAL.portal', 'TB_RTG.businesslogic', 'TB_RTG.operator', 'TB_OPERATION.script')
      .groupBy('TB_RTG.ambiente','TB_PORTAL.system', 'TB_PORTAL.portal', 'TB_RTG.businesslogic', 'TB_RTG.operator', 'TB_OPERATION.script')


      return response.json(operations);
    }

    return response.json([]);


  }
};
