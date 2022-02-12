//#region Importações
import { Meteoro } from "../models/meteoro";
import { MeteoroDAO } from "../services/meteoro.service";

var express = require('express');
var router = express.Router();
var mongoDB = require('config/database.ts');
const ObjectID = mongoDB.ObjectID();
mongoDB.connect();

declare global{
    var conn: any;
    var collection: any;
}

//#endregion

//#region Rotas
router.get('/', listarMeteoros);
router.get('/:_id', obterMeteoro);
router.get('/obterMeteoroPorSala/:idSala', obterMeteoroPorSala);
router.get('/obterSinalMeteoro/:_id', obterSinalMeteoro);

router.post('/', criar);

module.exports = router;

//#endregion

//#region Requisições GET
async function listarMeteoros(req: any, res: any) { 
    try{
        const dao = new MeteoroDAO(mongoDB, "Meteoro");
        let resultado = await dao.listar();
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex);
    }  
}

async function obterSinalMeteoro(req: any, res: any) { 
    try{
        const dao = new MeteoroDAO(mongoDB, "Sinais_Meteoro");
        let resultado = await dao.obterPeloId(req.params._id);
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex);
    }  
}

async function obterMeteoroPorSala(req: any, res: any) { 
    try{
        const dao = new MeteoroDAO(mongoDB, "Meteoro");
        let resultado = await dao.obterMeteoroPorSala(req.params.idSala);
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex);
    }  
}

async function obterMeteoro(req: any, res: any) { 
    try{
        const dao = new MeteoroDAO(mongoDB, "Meteoro");
        let resultado = await dao.obterPeloId(req.params._id);
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex);
    }  
}

//#endregion

//#region Requisições POST
async function criar(req: any, res: any) {
    try{
        const dao = new MeteoroDAO(mongoDB, "Meteoro");
        let meteoro = new Meteoro();  
        let alternativas = []; 
        meteoro.idSala = req.body.idSala;

        alternativas = await obterSinais();
        meteoro.sinaisMeteoro = alternativas.slice(0, 3);
        meteoro.alternativas = alternativas;
        let resultado = await dao.criar(meteoro);
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex.message);
    }  
}
//#endregion

//#region Métodos

async function obterSinais(){
    const dao = new MeteoroDAO(mongoDB,'Sinais_Meteoro');      
    const sinais = await dao.obterSinaisAleatorias();       
    return sinais;   
}

//#endregion







