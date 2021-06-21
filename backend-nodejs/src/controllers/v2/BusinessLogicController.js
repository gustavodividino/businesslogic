const connection = require("../../database/connection");
const createOperBusinessLogic = require("../../utils/createOperBusinessLogic");
const createOutputBusinessLogic = require("../../utils/createOutputBusinessLogic");
const createTermBusinessLogic = require("../../utils/createTermBusinessLogic");
const createEdgeBusinesslogic = require("../../utils/createEdgeBusinessLogic");

module.exports = {
  async index(request, response) {
    let businesslogic = await connection("TB_BUSINESSLOGIC").orderBy([
      { column: "ambiente", order: "asc" },
      { column: "businesslogic", order: "asc" },
    ]);

    return response.json(businesslogic);
  },

  async show(request, response) {

    const { ambiente, businesslogic } = request.query;

    if(ambiente != "" && businesslogic != ""){
      let businesslogics = await connection("TB_BUSINESSLOGIC").where({
        ambiente: ambiente,
        businesslogic: businesslogic,
      });
  
      return response.json(businesslogics);
    }
    return response.json([]);
  },

  async createBusinessLogic(request, response) {
    const { ambiente, businessLogic } = request.query;

    let operacoes = [];

    let rtg = await connection("TB_RTG").where({
      ambiente: ambiente,
      businesslogic: businessLogic,
    });

    let businesslogic = {
      id: businessLogic,
      sourcePosition: "right",
      targetPosition: "left",
      type: "input", //Indica que inicializa o fluxo
      className: "dark-node",
      data: { label: businessLogic },
      position: { x: 30, y: 80 },
      draggable: false,
      style: {
        background: "#efefff",
        color: "#333",
        border: "1px solid #222138",
        width: 110,
      },
    };

    operacoes.push(businesslogic);

    rtg.forEach((element) => {
      //Primeiro processo do Fluxo
      if (element.type == "OPER" && element.operator == "") {
        operacoes.push(createOperBusinessLogic(element));
        operacoes.push(createEdgeBusinesslogic(true, element));

        //Primeiro Output do Fluxo
      } else if (element.type == "OUTPUT" && element.operator == "") {
        operacoes.push(createOutputBusinessLogic(true, element));
        operacoes.push(createEdgeBusinesslogic(true, element));

        // OUTPUTS COMUNS
      } else if (element.type == "OUTPUT" && element.operator != "") {
        operacoes.push(createOutputBusinessLogic(false, element));
        operacoes.push(createEdgeBusinesslogic(false, element));

        // OPERS COMUNS
      } else if (element.type == "OPER" && element.operator != "") {
        operacoes.push(createOperBusinessLogic(element));
        operacoes.push(createEdgeBusinesslogic(false, element));

        //OUTPUT TERM
      } else if (element.type == "TERM" && element.operator != "") {
        operacoes.push(createTermBusinessLogic(element));
        operacoes.push(createEdgeBusinesslogic(false, element, true));
      }
    });

    //console.log(ligacoes);

    return response.json(operacoes);
  },
};
