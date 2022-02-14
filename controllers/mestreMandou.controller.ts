//#region Importações
import { MestreMandou } from "../models/mestreMandou";
import { SinalMestreMandou } from "../models/sinalMestreMandou";
import { MestreMandouDAO } from "../services/mestreMandou.service";
import { SinalMestreMandouDAO } from "../services/sinalMestreMandou.service";
import autenticacao from "../middleware/autenticacao";

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
router.get('/', autenticacao, listarJogos);
router.get('/:_id', autenticacao, obterJogo);
router.get('/obterSinal/:_id', autenticacao, obterSinal);
router.post('/', autenticacao, criar);
router.post('/criarSinal', autenticacao, criarSinal);

module.exports = router;

//#endregion

//#region Requisições GET
async function listarJogos(req: any, res: any) { 
    try{
        const dao = new MestreMandouDAO(mongoDB, "MestreMandou");
        let resultado = await dao.listar();
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex.message);
    }  
}

async function obterJogo(req: any, res: any) { 
    try{
        const dao = new MestreMandouDAO(mongoDB, "MestreMandou");
        let resultado = await dao.obterPeloId(req.params._id);
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex.message);
    }  
}

async function obterSinal(req: any, res: any) { 
    try{
        const dao = new MestreMandouDAO(mongoDB, "SinaisMestreMandou");
        let resultado = await dao.obterPeloId(req.params._id);
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex.message);
    }  
}

//#endregion

//#region Requisições POST
async function criar(req: any, res: any) {
    try{
        console.log('entrou')
        const dao = new MestreMandouDAO(mongoDB, "MestreMandou");
        let mestreMandou = new MestreMandou();  
        mestreMandou.idSala = req.body.idSala;
        mestreMandou.sinais = await obterSinais();
        let resultado = await dao.criar(mestreMandou);
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex.message);
    }  
}

async function criarSinal(req: any, res: any) {
    try{
        const dao = new SinalMestreMandouDAO(mongoDB, "SinaisMestreMandou");
        let sinalMestreMandou = new SinalMestreMandou();  
        sinalMestreMandou.descricao = req.body.descricao;
        let resultado = await dao.criar(sinalMestreMandou);
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex.message);
    }  
}
//#endregion

//#region Métodos

async function obterSinais(){
    const dao = new MestreMandouDAO(mongoDB,'SinaisMestreMandou');      
    const sinais = await dao.obterSinaisAleatorias();       
    return sinais;   
}

//#endregion







