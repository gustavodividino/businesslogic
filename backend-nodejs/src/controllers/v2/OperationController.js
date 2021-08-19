const connection = require("../../database/connection");

module.exports = {
  async show(request, response) {

    const { ambiente, operation } = request.query;

    if (ambiente != "" && operation != "") {
      let operations = await connection("TB_MM_OPERATION").where({
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
      let operations = await connection("TB_MM_OPERATION").where({
        script: script,
      });
      return response.json(operations);
    }

    return response.json([]);
    
  },

  async findByAssociationScript(request, response){

    const { ambiente, operation } = request.query;

    let oper = await connection("TB_MM_OPERATION")
    .where({
      ambiente: ambiente,
      operation: operation ,
    })

    const script = oper[0].script;

    if (script != "") {
      let operations = await connection("TB_MM_OPERATION").where({
        "TB_MM_OPERATION.script": script,
      })
      .join('TB_MM_RTG', 'TB_MM_OPERATION.operation', '=', 'TB_MM_RTG.operator')
      .join('TB_MM_PORTAL', 'TB_MM_RTG.businesslogic', '=', 'TB_MM_PORTAL.businesslogic')

      .select('TB_MM_RTG.ambiente','TB_MM_PORTAL.system', 'TB_MM_PORTAL.portal', 'TB_MM_RTG.businesslogic', 'TB_MM_RTG.operator', 'TB_MM_OPERATION.script')
      .groupBy('TB_MM_RTG.ambiente','TB_MM_PORTAL.system', 'TB_MM_PORTAL.portal', 'TB_MM_RTG.businesslogic', 'TB_MM_RTG.operator', 'TB_MM_OPERATION.script')


      return response.json(operations);
    }

    return response.json([]);


  }
};
