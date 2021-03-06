//#region Importações
import { Meteoro } from "../models/meteoro";
import { MeteoroDAO } from "../services/meteoro.service";
import autenticacao from "../middleware/autenticacao";
import { SinalMeteoro } from "../models/sinalMeteoro";
import { SinalMeteoroDAO } from "../services/sinalMeteoro.service";
import { ServiceSalaDAO } from "../services/sala.service";

var express = require('express');
var router = express.Router();
var mongoDB = require('config/database.ts');

declare global{
    var conn: any;
    var collection: any;
}
//#endregion

//#region Rotas
router.get('/', autenticacao, listarMeteoros);
router.get('/:_id', autenticacao, obterMeteoro);
router.get('/obterMeteoroPorSala/:idSala', autenticacao, obterMeteoroPorSala);
router.get('/obterSinal/:_id', autenticacao, obterSinalMeteoro);
router.post('/', autenticacao, criar);
router.post('/criarSinal', autenticacao, criarSinal);

module.exports = router;
//#endregion

//#region Requisições GET
async function listarMeteoros(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new MeteoroDAO(conexao, "Meteoro");
        let resultado = await dao.listar();
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex);
    }  
    finally{
        await conexao.close();
    }
}

async function obterSinalMeteoro(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new SinalMeteoroDAO(conexao, "SinaisMeteoro");
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

async function obterMeteoroPorSala(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new MeteoroDAO(conexao, "Meteoro");
        let resultado = await dao.obterMeteoroPorSala(req.params.idSala);
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex);
    }  
    finally{
        await conexao.close();
    }
}

async function obterMeteoro(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new MeteoroDAO(conexao, "Meteoro");
        let resultado = await dao.obterPeloId(req.params._id);
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex);
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
        const dao = new MeteoroDAO(conexao, "Meteoro");
        const daoSala = new ServiceSalaDAO(conexao,'Salas');
        let salaMeteoro = null;

        let sala = await daoSala.obterPeloId(req.body.idSala); 

        if(sala.tipoJogo == 'Meteoro'){
            salaMeteoro = await dao.obterMeteoroPorSala(req.body.idSala); 
            
            if(salaMeteoro.length == 0){
                let meteoro = new Meteoro();  
                let alternativas = []; 
                meteoro.idSala = req.body.idSala;
        
                alternativas = await obterSinais(conexao);
                meteoro.sinais = alternativas.slice(0, 3);
                meteoro.alternativas = alternativas;
                let resultado = await dao.criar(meteoro);
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
        const dao = new SinalMeteoroDAO(conexao, "SinaisMeteoro");
        let sinal = new SinalMeteoro();  
        sinal.descricao = req.body.descricao;
        sinal.caminhoImagem = req.body.caminhoImagem;
        let resultado = await dao.criar(sinal);
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
    const dao = new SinalMeteoroDAO(conexao,'SinaisMeteoro');      
    const sinais = await dao.obterSinaisAleatorias();       
    return sinais;   
}

//#endregion







