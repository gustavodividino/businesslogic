module.exports = function createOperBusinessLogic(element) {

  let oper = {};

    let processName = element.nextLevel.trim().split(":");

    oper = {
      id: processName[1].trim(),
      sourcePosition: "right",
      targetPosition: "left",
      data: { label: processName[1].trim() },
      position: { x: 250, y: 160 },
      draggable:false,
      style: {
        background: "#efefff",
        color: "#333",
        border: "1px solid #222138",
        width: 100,
      },
    };

  return oper;
};
