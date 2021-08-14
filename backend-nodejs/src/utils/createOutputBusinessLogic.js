const { recollect } = require("../controllers/v2/CargasController");
const connection = require("../database/connection");

module.exports = function createOutputBusinessLogic(isFirst, element) {
  let output = {};
  let style = {};
  let outputName = element.nextLevel.trim().split(":");
  let name = outputName[1].trim();
/*  let portalRecollect = await connection("TB_PORTAL").where({
    system: name.split("|")[0].trim(),
    portal: name.split("|")[1].trim(),
    type: "O"
  });
*/

  if (element.recollect == "1") {
    console.log(name + '|' + element.recollect)
    style = {
      background: "#99cc00",
      color: "#333",
      border: "1px solid #222138",
      width: 110,
    };
  } else {
    style = {
      background: "#a5a5f9",
      color: "#333",
      border: "1px solid #222138",
      width: 110,
    };
  }

  output = {
    id: name,
    type: "output", //Indica que finaliza o fluxo
    sourcePosition: "right",
    targetPosition: "left",
    data: { label: name },
    position: { x: 290, y: 180 },
    draggable: false,
    style: style,
  };

  console.log(output);


  return output;
};
