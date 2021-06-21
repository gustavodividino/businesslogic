const { Router } = require('express')

const AmbientesController = require('./controllers/v2/AmbientesController')
const BusinessLogicController = require('./controllers/v2/BusinessLogicController')
const RtgController = require('./controllers/v2/RtgController')
const PortalController = require('./controllers/v2/PortalController')
const CargaController = require('./controllers/v2/CargasController')
const OperationController = require('./controllers/v2/OperationController')

const routes = Router();

/** API v2 */

routes.get('/portal', PortalController.index);                       //Retorna todos os Portais cadastrados
routes.get('/ambiente', AmbientesController.index);                  //Retorna todos os Ambientes cadastrados
routes.get('/businesslogic', BusinessLogicController.index);         //Retorna todos os BusinessLogics cadastrados
routes.get('/businesslogic/filter', BusinessLogicController.show);         


routes.get('/rtg', RtgController.index);                             //Retorna todos os RTGs cadastrados
routes.get('/rtg/filter', RtgController.show);                       //Retorna todos os RTGs cadastrados

/*Rotas de Carga de arquivos */
routes.put('/carga/portal', CargaController.portal);
routes.put('/carga/rtg', CargaController.rtg);
routes.put('/carga/businesslogic', CargaController.businesslogic);
routes.put('/carga/operation', CargaController.operation);
routes.put('/carga/script', CargaController.scripts);
routes.put('/carga/recollect', CargaController.recollect);


routes.get('/portal/filter', PortalController.show);                       //Retorna informacao de um unico portal
routes.get('/portal/filter/businesslogic', PortalController.findByBusinesslogic)             
routes.get('/portal/recollect', PortalController.recollect)             //Retorna  os portais de Recollect de um path




routes.get('/operation/filter', OperationController.show);              //Retorna informacao de uma unica Operation
routes.get('/operation/filter/script', OperationController.findByScript);              
routes.get('/operation/filter/script/association', OperationController.findByAssociationScript);              


routes.get('/createbusinesslogic', BusinessLogicController.createBusinessLogic);  //Retorna a criação de um BusinessLogic


module.exports = routes;