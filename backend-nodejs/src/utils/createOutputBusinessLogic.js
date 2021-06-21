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

  if (1 == 2) {
    name += '*';
    style = {
      background: "#a5a5f9",
      fontWeight: "bold",
      color: "#333",
      border: "1px solid 222138",
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
  return output;
};
