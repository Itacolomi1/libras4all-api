//#region Importações
import { MestreMandou } from "../models/mestreMandou";
import { SinalMestreMandou } from "../models/sinalMestreMandou";
import { MestreMandouDAO } from "../services/mestreMandou.service";
import { SinalMestreMandouDAO } from "../services/sinalMestreMandou.service";
import { ServiceSalaDAO } from "../services/sala.service";
import autenticacao from "../middleware/autenticacao";

var express = require('express');
var router = express.Router();
var mongoDB = require('config/database.ts');

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
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new MestreMandouDAO(conexao, "MestreMandou");
        let resultado = await dao.listar();
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex.message);
    }  
    finally{
        await conexao.close();
    }
}

async function obterJogo(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new MestreMandouDAO(conexao, "MestreMandou");
        let resultado = await dao.obterPeloId(req.params._id);
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex.message);
    }
    finally{
        await conexao.close();
    }  
}

async function obterSinal(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new MestreMandouDAO(conexao, "SinaisMestreMandou");
        let resultado = await dao.obterPeloId(req.params._id);
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex.message);
    }
    finally{
        await conexao.close();
    }  
}

//#endregion

//#region Requisições POST
async function criar(req: any, res: any) {
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new MestreMandouDAO(conexao, "MestreMandou");
        const daoSala = new ServiceSalaDAO(conexao,'Salas');
        let salaMestreMandou = null;

        let sala = await daoSala.obterPeloId(req.body.idSala); 

        if(sala.tipoJogo == 'Mestre Mandou'){
            salaMestreMandou = await dao.obterMestreMandouPorSala(req.body.idSala); 
            
            if(salaMestreMandou.length == 0){
                let mestreMandou = new MestreMandou();  
                mestreMandou.idSala = req.body.idSala;
                mestreMandou.sinais = await obterSinais(conexao);
                let resultado = await dao.criar(mestreMandou);
                res.send(resultado);
            }
            else{
                throw new Error('{"mensagem": "Já existe um jogo cadastrado na sala"}');
            }
        }
        else{
            throw new Error('{"mensagem": "A sala cadastrada é de outro tipo!"}');
        }    
    }
    catch(ex){
        res.status(500).send(ex.message);
    } 
    finally{
        await conexao.close();
    } 
}

async function criarSinal(req: any, res: any) {
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new SinalMestreMandouDAO(conexao, "SinaisMestreMandou");
        let sinalMestreMandou = new SinalMestreMandou();  
        sinalMestreMandou.descricao = req.body.descricao;
        let resultado = await dao.criar(sinalMestreMandou);
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex.message);
    } 
    finally{
        await conexao.close();
    } 
}
//#endregion

//#region Métodos

async function obterSinais(conexao: any){
    const dao = new MestreMandouDAO(conexao,'SinaisMestreMandou');      
    const sinais = await dao.obterSinaisAleatorias();       
    return sinais;   
}

//#endregion







