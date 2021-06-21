const connection = require("../../database/connection");

module.exports = {
  async index(request, response) {
    const ambiente = [
      { id: "", name: "- Todos -" },
      { id: "BAT1", name: "BAT1" },
      { id: "BAT2", name: "BAT2" },
      { id: "ON-CO", name: "Online CO" },
      { id: "ON-PRNM", name: "Online PRNM" },
      { id: "ON-RJBA", name: "Online RJBA" },
      { id: "ON-SP", name: "Online SP" },
      { id: "FIX-COL", name: "Fixa Coleta" },
      { id: "FIX-PROC", name: "Fixa Processo" },
      { id: "RMG", name: "Roaming Manager Prep" },
    ];

    return response.json(ambiente);
  },
};
