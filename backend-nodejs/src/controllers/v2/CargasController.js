require("dotenv/config");
const connection = require("../../database/connection");
const readline = require("readline");
const fs = require("fs");

const findFilesOnDirectory = require("../../utils/findFilesOnDirectory");

const updateLog = async function (tableName, totalLinhas) {
  const data = new Date();
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  const dataAtual = mes + "/" + dia + "/" + ano;

  let tableUpdate = await connection("TB_MM_UPDATE").where({
    tableName: tableName,
  });

  if (tableUpdate[0] != undefined) {
    tableUpdate = await connection("TB_MM_UPDATE")
      .where({
        tableName: tableName,
      })
      .update({
        totalLinhas: totalLinhas,
        updated_at: dataAtual,
      });
  } else {
    tableUpdate = await connection("TB_MM_UPDATE").insert({
      tableName: tableName,
      totalLinhas: totalLinhas,
      created_at: dataAtual,
      updated_at: dataAtual,
    });
  }
  return true;
};

module.exports = {
  async portal(request, response) {
    let contadorLinhas = 0;
    let scriptPath = "";
    console.log("Iniciando carregando dos Portais...");
    let arquivos = await findFilesOnDirectory("_PORTALROUTE_");
    let portais = [];

    for await (let file of arquivos) {
      console.log("--------" + file + "---------------");
      const fileStream = fs.createReadStream("files/" + file);

      const fileName = file.split("_");
      const ambiente = fileName[0];

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        if (
          line.indexOf("|||") && //* Pega somente o que é "|||"
          line.indexOf("----------------+---+") && //* Pega somente o que é "----------------+---+"
          line.indexOf("Read") && //* Pega somente o que é Read
          line.indexOf("dcs_dp_search_root_recs") && //* Pega somente o que é dcs_dp_search_root_recs
          line.trim().valueOf("")
        ) {
          const linha = line.split("|");

          let path = linha[5].trim();
          const lastCharPath = path.substr(linha[5].trim().length - 1, 1);

          if (lastCharPath != "/") {
            path += "/";
          }

          if (!ambiente.indexOf("FIX-")) {
            scriptPath = process.env.FIXA_REPO;
          } else if (!ambiente.indexOf("RMG")) {
            scriptPath = "";
          } else {
            scriptPath = process.env.MOVEL_REPO;
          }

          let statusPortal = linha[7].trim();
          if (statusPortal == "A") {
            statusPortal = "enable";
          } else if (statusPortal == "S") {
            statusPortal = "disable";
          }

          const portal = {
            ambiente: ambiente,
            system: linha[0].trim(),
            portal: linha[1].trim(),
            type: linha[2].trim(),
            businesslogic: linha[3].trim(),
            server: linha[4].trim(),
            path: path,
            script: scriptPath + linha[6].trim() + ".scr",
            status: statusPortal,
          };

          try {
            const operationModel = await connection("TB_MM_PORTAL").insert(portal);
            portais.push(portal);
            contadorLinhas++;
          } catch (e) {
            console.log(
              e +
                ": [" +
                portal.ambiente +
                "][" +
                portal.system +
                "][" +
                portal.portal +
                "]"
            );
          }
        }
      }
    }

    await connection("TB_MM_PORTAL")
      .where("path", "like", "/cgi/RMG/output/medout/rsr/%")
      .update({
        path: "/cgi/RMG/output/medout/rsr/",
      });

    updateLog("TB_MM_PORTAL", contadorLinhas);
    console.log("Carregamento de Portais concluído.");

    return response.json(portais);
  },

  async rtg(request, response) {
    let contadorLinhas = 0;
    console.log("Iniciando carregando dos RTG...");
    let arquivos = await findFilesOnDirectory("_RTG_");
    let rtgs = [];

    for await (let file of arquivos) {
      console.log("--------" + file + "---------------");
      const fileStream = fs.createReadStream("files/" + file);

      const fileName = file.split("_");
      const ambiente = fileName[0];

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        if (
          line.indexOf("Found ") && //* Retirar a linha que tiver com a string Found
          line.indexOf("PMU>") && //* Retirar a linha que tiver com a string PMU
          line.indexOf("No TERM environment") && //* Retirar a linha que tiver com a string No TERM environment
          line.trim().valueOf("")
        ) {
          const linha = line.split("|");

          //AMDOCS2|||OPER : AMDOCS_SPL
          if (linha[3].substring(0, 4) == "OPER" && linha[1] == "") {
            const rtg = {
              ambiente: ambiente,
              businesslogic: linha[0],
              operator: linha[1],
              nameOutput: linha[2],
              nextLevel: linha[3],
              type: linha[3].substring(0, 4),
            };

            //Primeiro Processo do fluxo
            const rtgModel = await connection("TB_MM_RTG").insert(rtg);
            rtgs.push(rtg);
            contadorLinhas++;
          }

          //MIGCLI|||OUTPUT : MIGCLI | BACKUP
          if (linha[3].substring(0, 6) == "OUTPUT" && linha[1] == "") {
            //Primeiro Portal do Fluxo
            const outputTeste = linha[3] + "|" + linha[4];

            const rtg = {
              ambiente: ambiente,
              businesslogic: linha[0],
              operator: linha[1],
              nameOutput: linha[2],
              nextLevel: outputTeste.replace(/ /g, ""),
              type: linha[3].substring(0, 6),
            };

            const rtgModel = await connection("TB_MM_RTG").insert(rtg);
            rtgs.push(rtg);
            contadorLinhas++;
          }

          //AMDOCS3|AMDCHECK_NE|TAB_NE|OPER : AMDOCS_NE
          if (linha[3].substring(0, 4) == "OPER" && linha[1] != "") {
            //Operação Normal
            const rtg = {
              ambiente: ambiente,
              businesslogic: linha[0],
              operator: linha[1],
              nameOutput: linha[2],
              nextLevel: linha[3],
              type: linha[3].substring(0, 4),
            };
            const rtgModel = await connection("TB_MM_RTG").insert(rtg);
            rtgs.push(rtg);
            contadorLinhas++;
          }

          //BDOFSEP|BDO_F_SEPAR|BDO_0|OUTPUT : BDO | OUTTBF0
          if (linha[3].substring(0, 6) == "OUTPUT" && linha[1] != "") {
            //Output de saída de um processo
            const outputTeste = linha[3] + "|" + linha[4];
            const rtg = {
              ambiente: ambiente,
              businesslogic: linha[0],
              operator: linha[1],
              nameOutput: linha[2],
              nextLevel: outputTeste.replace(/ /g, ""),
              type: linha[3].substring(0, 6),
            };
            const rtgModel = await connection("TB_MM_RTG").insert(rtg);
            rtgs.push(rtg);
            contadorLinhas++;
          }

          //FDETRA3|PROC026_V03|GAR_REC|TERM : 1

          if (linha[3].substring(0, 4) == "TERM" && linha[1] != "") {
            //TERM de saída de um processo
            const rtg = {
              ambiente: ambiente,
              businesslogic: linha[0],
              operator: linha[1],
              nameOutput: linha[2],
              nextLevel: linha[3],
              type: linha[3].substring(0, 4),
            };
            const rtgModel = await connection("TB_MM_RTG").insert(rtg);
            rtgs.push(rtg);
            contadorLinhas++;
          }
        }
      }
    }
    updateLog("TB_MM_RTG", contadorLinhas);
    console.log("Carregamento de RTG concluído.");

    return response.json(rtgs);
  },

  async businesslogic(request, response) {
    let contadorLinhas = 0;
    console.log("Iniciando carregando dos BusinessLogic...");
    let arquivos = await findFilesOnDirectory("_BL_");
    let businesslogics = [];

    for await (let file of arquivos) {
      console.log("--------" + file + "---------------");
      const fileStream = fs.createReadStream("files/" + file);

      const fileName = file.split("_");
      const ambiente = fileName[0];

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        if (
          line.indexOf("Found ") && //* Retirar a linha que tiver com a string Found
          line.indexOf("PMU>") && //* Retirar a linha que tiver com a string PMU
          line.indexOf("No TERM environment") &&
          line.trim().valueOf("") //* Retirar a linha que tiver com a string No TERM environment
        ) {
          const linha = line.split("|");
          const businesslogic = {
            ambiente: ambiente,
            businesslogic: linha[0].trim(),
            status: linha[1],
            description: linha[2],
          };

          try {
            const businesslogicModel = await connection(
              "TB_MM_BUSINESSLOGIC"
            ).insert(businesslogic);
            businesslogics.push(businesslogic);
            contadorLinhas++;
          } catch (e) {
            console.log(
              e +
                ": [" +
                businesslogic.ambiente +
                "][" +
                businesslogic.system +
                "]"
            );
          }
        }
      }
    }
    updateLog("TB_MM_BUSINESSLOGIC", contadorLinhas);
    console.log("Carregamento de BusinessLogic concluído.");

    return response.json(businesslogics);
  },

  async operation(request, response) {
    let contadorLinhas = 0;
    console.log("Iniciando carregando dos Operation...");
    let arquivos = await findFilesOnDirectory("_OPER_");
    let operations = [];

    for await (let file of arquivos) {
      console.log("--------" + file + "---------------");
      const fileStream = fs.createReadStream("files/" + file);

      const fileName = file.split("_");
      const ambiente = fileName[0];

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        if (
          line.indexOf("Operation: ") != -1 && //* Pega somente o que é Operation
          line.trim().valueOf("")
        ) {
          const linha = line.split(":");
          const linhaDesc = linha[1].split("-");
          const operation = {
            ambiente: ambiente,
            operation: linhaDesc[0].trim(),
            description: linhaDesc[1].trim(),
            script: "",
          };

          try {
            const operationModel = await connection("TB_MM_OPERATION").insert(
              operation
            );
            operations.push(operation);
            contadorLinhas++;
          } catch (e) {
            console.log(
              e + ": [" + operation.ambiente + "][" + operation.operation + "]"
            );
          }
        }
      }
    }
    updateLog("TB_MM_OPERATION", contadorLinhas);
    console.log("Carregamento de Operation concluído.");

    return response.json(operations);
  },

  async scripts(request, response) {
    let contadorLinhas = 0;
    console.log("Iniciando carregando dos Scripts...");
    let arquivos = await findFilesOnDirectory("_SCRIPT_");

    let scriptName = "";
    let descriptionScript = "";
    let operName = "";

    let pegarOperation = false;
    let pegarProximaLinha = false;

    for await (let file of arquivos) {
      console.log("--------" + file + "---------------");
      let scriptPath = "";

      const fileStream = fs.createReadStream("files/" + file);

      const fileName = file.split("_");
      const ambiente = fileName[0];

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        if (!line.indexOf("	References GDC Records:")) {
          pegarProximaLinha = false;
          pegarOperation = false;
        }

        //Verifica se precisa pegar a linha Atual para conseguir pegar o OPERATOR do Script
        if (pegarProximaLinha && pegarOperation) {
          //pegarProximaLinha = false;
          //pegarOperation = false;
          if (line.trim() == "< NONE >") {
            operName = "";
          } else {
            operName = line.split("-")[0];
            //console.log(ambiente + "|" + operName.trim() + "|" + scriptName.trim() + "|" + descriptionScript.trim());

            if (!ambiente.indexOf("FIX-")) {
              scriptPath = process.env.FIXA_REPO;
            } else if (!ambiente.indexOf("RMG")) {
              scriptPath = "";
            } else {
              scriptPath = process.env.MOVEL_REPO;
            }

            const script = {
              script: scriptPath + scriptName.trim() + ".scr",
              scriptDescription: descriptionScript.trim(),
            };
            operModel = await connection("TB_MM_OPERATION")
              .where({
                ambiente: ambiente,
                operation: operName.trim(),
              })
              .update(script);
            contadorLinhas++;
          }
        }

        //Verifica se a linha é a que contém o SCRIPT
        if (!line.indexOf("GDC Script: ")) {
          pegarOperation = true;
          scriptName = line.split(":")[1];
          descriptionScript = line.split(":")[2];
        }

        //Verifica se a linha é a que contém o HEADER antes do OPERATOR
        if (!line.indexOf("	Referenced by Operations:")) {
          pegarProximaLinha = true;
        }
      }
    }
    updateLog("TB_MM_OPERATION - Scripts", contadorLinhas);
    console.log("Carregamento de Script concluído.");

    return response.sendStatus(200);
  },

  async recollect(request, response) {
    let contadorLinhas = 0;
    console.log("Iniciando Verificação de Recoleta...");
    //Pesquisa todos os portais de Output
    let portalOutput = await connection("TB_MM_PORTAL")
      .where("type", "=", "O")
      .whereNot("path", "=", "/");

    //console.log("Verificando: " + portalOutput.length);

    for await (let portal of portalOutput) {
      let portalInput = await connection("TB_MM_PORTAL").where({
        path: portal.path,
        type: "I",
      });

      if (portalInput[0] != undefined) {
        portalModel = await connection("TB_MM_PORTAL")
          .where({
            ambiente: portal.ambiente,
            system: portal.system,
            portal: portal.portal,
            type: "O",
          })
          .update({
            recollect: "1",
          });
        const portalOut = "OUTPUT:" + portal.system + "|" + portal.portal;

        await connection("TB_MM_RTG")
          .where({
            ambiente: portal.ambiente,
            nextLevel: portalOut,
          })
          .update({
            recollect: "1",
          });

        contadorLinhas++;
      }
    }
    updateLog("TB_MM_PORTAL - Recoletas", contadorLinhas);
    console.log("Verificação de Recoleta concluído.");
    return response.sendStatus(200);
  },

  async cdrsIRPT(request, response) {
    let contadorLinhas = 0;
    console.log("Iniciando carregando do IRPT ...");
    let arquivos = await findFilesOnDirectory("IRPT_CDR");
    let portais = [];

    for await (let file of arquivos) {
      console.log("--------" + file + "---------------");
      const fileStream = fs.createReadStream("files/" + file);

      const fileName = file.split("_");
      const ambiente = fileName[0];

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        const linha = line.replace('"', "").split(",");
        const systemPortal = linha[1].replace('"', "").split("|");
        //console.log(systemPortal[0] + '-' + systemPortal[1] + '-' +linha[2].trim());

        let portalInput = await connection("TB_MM_PORTAL").where({
          system: systemPortal[0].trim(),
          portal: systemPortal[1].trim(),
        });

        if (portalInput[0] != undefined) {
          portalModel = await connection("TB_MM_PORTAL")
            .where({
              system: systemPortal[0].trim(),
              portal: systemPortal[1].trim(),
            })
            .update({
              cdrs: linha[2].trim(),
            });

          contadorLinhas++;
        }
      }
    }
    updateLog("TB_MM_PORTAL - IRPTs", contadorLinhas);
    console.log("Carregamento de Input IRPT concluído.");

    return response.json(portais);
  },

  async fluxos(request, response) {
    let portalInput = "";
    let contadorLinhas = 0;
    console.log("Iniciando Atualização de Fluxo.");
    const flows = await connection("TB_MM_FLUXO").orderBy([
      { column: "flow", order: "asc" },
    ]);

    for await (const flow of flows) {
      if (flow.isAll) {
        if (flow.portal == "*") {
          portalInput = await connection("TB_MM_PORTAL").where(
            "system",
            "like",
            "%" + flow.system + "%"
          );

          for await (const portal of portalInput) {
            //console.log("Atualizando" + portal.system + portal.portal)
            let portalUpdate = await connection("TB_MM_PORTAL")
              .where({
                system: portal.system,
                portal: portal.portal,
              })
              .update({
                flow: flow.name,
              });

            contadorLinhas++;
          }
        }
      } else {
        let system = "";
        if (flow.system != "*") {
          system = flow.system;
        }
        portalInput = await connection("TB_MM_PORTAL")
          .where("system", "like", "%" + system + "%")
          .andWhere("portal", "=", flow.portal);
        //console.log(system + flow.portal);

        for await (const portal of portalInput) {
          //console.log("Atualizando" + portal.system + portal.portal)
          let portalUpdate = await connection("TB_MM_PORTAL")
            .where({
              system: portal.system,
              portal: portal.portal,
            })
            .update({
              flow: flow.name,
            });

          contadorLinhas++;
        }
      }
    }
    updateLog("TB_MM_PORTAL - Fluxo", contadorLinhas);
    console.log("Atualização de Fluxo concluído.");
    return response.json(portalInput);
  },

  async etapasIRPT(request, response) {
    let contadorLinhas = 0;
    console.log("Iniciando carregando do Etapas IRPT ...");
    let arquivos = await findFilesOnDirectory("IRPT_ETAPAS_");
    let portais = [];

    for await (let file of arquivos) {
      console.log("--------" + file + "---------------");
      const fileStream = fs.createReadStream("files/" + file);

      const fileName = file.split("_");
      const ambiente = fileName[0];

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        const linha = line.replace('"', "").split(",");
        const systemPortal = linha[0].replace('"', "").split("|");

        //console.log(systemPortal[0] + '-' + systemPortal[1] + '-' + linha[1].trim());

        let portalEtapas = await connection("TB_MM_ETAPA").where({
          system: systemPortal[0].trim(),
          portal: systemPortal[1].trim(),
          etapa: linha[1].trim(),
        });

        if (portalEtapas[0] == undefined) {
          await connection("TB_MM_ETAPA").insert({
            system: systemPortal[0].trim(),
            portal: systemPortal[1].trim(),
            etapa: linha[1].trim(),
          });

          contadorLinhas++;
        }
      }
    }
    updateLog("TB_MM_ETAPA - Etapas IRPTs", contadorLinhas);
    console.log("Carregamento de Input Etapas IRPTs concluído.");

    return response.json(portais);
  },
};
