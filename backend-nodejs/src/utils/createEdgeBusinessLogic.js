module.exports = function createEdgeBusinessLogic(isFirst, element, isTerm) {
  let processName = element.nextLevel.trim().split(":");
  let edge = {};

  if (isFirst) {
    edge = {
      id: element.businesslogic + "-" + processName[1].trim(),
      type: "step",
      source: element.businesslogic,
      target: processName[1].trim(),
      label: "Master",
      labelStyle: { fontWeight: 700 },
      labelBgPadding: [8, 4],
      labelBgBorderRadius: 4,
      labelBgStyle: { fill: "#ffe86a", color: "#fff", fillOpacity: 0.7 },
      arrowHeadType: "arrowclosed",
      animated: true,
    };
  } else if (isTerm) {
    let outputName = element.nextLevel.trim().split(":");

    edge = {
      id:
        element.operator +
        "-" +
        outputName[0].trim() +
        "-" +
        outputName[1].trim(),
      type: "step",
      source: element.operator,
      target: outputName[0].trim() + "-" + outputName[1].trim(),
      label: element.nameOutput,
      labelBgPadding: [8, 4],
      labelBgBorderRadius: 4,
      labelBgStyle: { fill: "#ffe86a", color: "#fff", fillOpacity: 0.7 },
      arrowHeadType: "arrowclosed",
      animated: true,
    };
  } else {
    edge = {
      id: element.operator + "-" + processName[1].trim(),
      type: "step",
      source: element.operator,
      target: processName[1].trim(),
      label: element.nameOutput,
      labelBgPadding: [8, 4],
      labelStyle: { fontWeight: 700 },
      labelBgBorderRadius: 4,
      labelBgStyle: { fill: "#ffe86a", color: "#fff", fillOpacity: 0.7 },
      arrowHeadType: "arrowclosed",
      animated: true,
    };
  }
  return edge;
};
