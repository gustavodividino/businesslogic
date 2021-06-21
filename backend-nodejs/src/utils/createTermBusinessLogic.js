module.exports = function createTermBusinessLogic(element) {

    let outputTerm = {};

    let outputName = element.nextLevel.trim().split(":");

        //console.log(outputName[0].trim() + "-" + outputName[1].trim());

        outputTerm = {
          id: outputName[0].trim() + "-" + outputName[1].trim(),
          type: "output", //Indica que finaliza o fluxo
          sourcePosition: "right",
          targetPosition: "left",
          data: { label: outputName[0].trim() + "-" + outputName[1].trim() },
          position: { x: 290, y: 180 },
          draggable:false,
          style: {
            background: "#cc9a7a",
            fontWeight: "bold",
            color: "#333",
            border: "1px solid #222138",
            width: 70,
          },
        };


        return outputTerm;


}