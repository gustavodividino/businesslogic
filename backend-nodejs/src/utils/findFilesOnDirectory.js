const fs = require("fs").promises;

module.exports = async function findFilesOnDirectory(type) {
  let diretorio = "files";
  let arquivos = [];

  let listaDeArquivos = await fs.readdir(diretorio);

  for (let k in listaDeArquivos) {
    if (listaDeArquivos[k].indexOf(type) > -1) {
      arquivos.push(listaDeArquivos[k]);
    }
  }

  return arquivos;
};
