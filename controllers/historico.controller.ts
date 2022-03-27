//#region Importações
import { Historico } from "../models/historico";
import { HistoricoDAO } from "../services/historico.service";
import { ServiceSalaDAO } from "../services/sala.service";
import { QuizDAO } from "../services/quiz.service";
import { MeteoroDAO } from "../services/meteoro.service";
import { MestreMandouDAO } from "../services/mestreMandou.service";
import { UsuarioDAO } from "../services/usuario.service";
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
router.get('/', autenticacao, listarHistorico);
router.get('/porcentagem/:idSala/:idItem', autenticacao, obterQuantidadePorItem);
router.get('/quantidadePorAluno/:idSala/:idUsuario', autenticacao, quantidadePorAluno);
router.get('/obterItens/:idSala', autenticacao, obterItens);
router.get('/obterMelhoresAlunos/:idSala', autenticacao, obterMelhoresAlunos);
router.get('/obterDadosPorAlunoSala/:idSala/:idUsuario', autenticacao, obterDadosPorAlunoSala);
router.post('/', autenticacao, criar);

module.exports = router;
//#endregion

//#region Requisições GET
async function listarHistorico(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new HistoricoDAO(conexao, "Historico");
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

async function obterItens(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const daoSala = new ServiceSalaDAO(conexao, "Salas");
        let itens;
        let resultado = await daoSala.obterPeloId(req.params.idSala); 
        if(resultado.tipoJogo == "Quiz"){
            itens = await buscarPerguntasQuiz(req.params.idSala, conexao);
        }
        else if(resultado.tipoJogo == "Meteoro"){
            itens = await buscarSinaisMeteoro(req.params.idSala, conexao);
        }
        else if(resultado.tipoJogo == "Mestre Mandou"){
            itens = await buscarSinaisMestreMandou(req.params.idSala, conexao);
        }
        res.send(itens);
    }
    catch(ex){
        res.status(500).send(ex.message);
    } 
    finally{
        await conexao.close();
    } 
}

async function obterQuantidadePorItem(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new HistoricoDAO(conexao, "Historico");
        let registrosHistorico = await dao.obterPorcentagemPorItem(req.params.idSala, req.params.idItem);
        var registrosErro = registrosHistorico.filter(function (e: any) {
            return e.acerto == "true"
        });

        var registrosAcerto = registrosHistorico.filter(function (e: any) {
            return e.acerto == "false";
        });

        let quantidadeAcertos = Object.keys(registrosAcerto).length;
        let quantidadeErros = Object.keys(registrosErro).length;
       
        var retorno = {
            quantidadeAcertos: quantidadeAcertos,
            quantidadeErros: quantidadeErros
        };
       
        res.send(retorno);
    }
    catch(ex){
        res.status(500).send(ex.message);
    } 
    finally{
        await conexao.close();
    } 
}

async function quantidadePorAluno(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new HistoricoDAO(conexao, "Historico");
        let registrosHistorico = await dao.obterPorcentagemPorAluno(req.params.idSala, req.params.idUsuario);

        var registrosErro = registrosHistorico.filter(function (e: any) {
            return e.acerto == "true"
        });

        var registrosAcerto = registrosHistorico.filter(function (e: any) {
            return e.acerto == "false";
        });

        let quantidadeAcertos = Object.keys(registrosAcerto).length;
        let quantidadeErros = Object.keys(registrosErro).length;
        
        var retorno = {
            quantidadeAcertos: quantidadeAcertos,
            quantidadeErros: quantidadeErros
        };
        
        res.send(retorno);
    }
    catch(ex){
        res.status(500).send(ex.message);
    } 
    finally{
        await conexao.close();
    } 
}

async function obterMelhoresAlunos(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new HistoricoDAO(conexao, "Historico");
        let historicosPorSala = await dao.obterMelhoresAlunos(req.params.idSala);     
        res.send(historicosPorSala);
    }
    catch(ex){
        res.status(500).send(ex.message);
    } 
    finally{
        await conexao.close();
    } 
}

async function obterDadosPorAlunoSala(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new HistoricoDAO(conexao, "Historico");
        let registrosHistorico = await dao.obterPorcentagemPorAluno(req.params.idSala, req.params.idUsuario);           
        res.send(registrosHistorico);
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
        let historico = new Historico();    
        historico.idSala = req.body.idSala;
        historico.idUsuario = req.body.idUsuario;
        historico.idItem = req.body.idItem;
        historico.tipoJogo = req.body.tipoJogo;
        historico.acerto = req.body.acerto;
        historico.data = new Date();

        const dao = new HistoricoDAO(conexao,'Historico');
        let resultado = await dao.criar(historico);  

        if(req.body.acerto == "true"){
            await atualizarUsuario(req.body.idUsuario, conexao);        
        }
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

async function buscarPerguntasQuiz(idSala: any, conexao: any){
    const daoQuiz = new QuizDAO(conexao, "Quiz");
    const itens = (await daoQuiz.obterPeloItem(idSala)).perguntas;
    return itens;
}

async function buscarSinaisMeteoro(idSala: any, conexao: any){
    const daoMeteoro = new MeteoroDAO(conexao, "Meteoro");
    const itens = (await daoMeteoro.obterPeloItem(idSala)).sinais;
    return itens;
}

async function buscarSinaisMestreMandou(idSala: any, conexao: any){
    const daoMeteoro = new MestreMandouDAO(conexao, "MestreMandou");
    const itens = (await daoMeteoro.obterPeloItem(idSala)).sinais;
    return itens;
}

async function atualizarUsuario(idUsuario: any, conexao: any) {
    try{
        const dao = new UsuarioDAO(conexao,'Usuarios');
        let libracoinsPorAcerto = 10;
        let usuario = await dao.obterPeloId(idUsuario); 
        usuario.libracoins = usuario.libracoins + libracoinsPorAcerto;
        let resultado = await dao.atualizar(idUsuario, usuario); 

    }catch(ex){
       console.log('Erro ao atualizar o Usuario');
       console.log(ex);
    }
 
}
//#endregion