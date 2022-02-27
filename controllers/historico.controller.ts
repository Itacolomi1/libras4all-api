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
const ObjectID = mongoDB.ObjectID();
mongoDB.connect();

declare global{
    var conn: any;
    var collection: any;
}

//#endregion

//#region Rotas
router.get('/', autenticacao, listarHistorico);
router.get('/porcentagem/:idSala/:idItem', autenticacao, obterPorcentagemPorItem);
router.get('/porcentagemAluno/:idSala/:idUsuario', autenticacao, obterPorcentagemPorAluno);
router.get('/obterItens/:idSala', autenticacao, obterItens);
router.get('/obterMelhoresAlunos/:idSala', autenticacao, obterMelhoresAlunos);
router.post('/', autenticacao, criar);

module.exports = router;

//#endregion

//#region Requisições GET
async function listarHistorico(req: any, res: any) { 
    try{
        const dao = new HistoricoDAO(mongoDB, "Historico");
        let resultado = await dao.listar();
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex);
    }  
}

async function obterItens(req: any, res: any) { 
    try{
        const daoSala = new ServiceSalaDAO(mongoDB, "Salas");
        let itens;
        let resultado = await daoSala.obterPeloId(req.params.idSala); 
        if(resultado.tipoJogo == "Quiz"){
            itens = await buscarPerguntasQuiz(req.params.idSala);
        }
        else if(resultado.tipoJogo == "Meteoro"){
            itens = await buscarSinaisMeteoro(req.params.idSala);
        }
        else if(resultado.tipoJogo == "MestreMandou"){
            itens = await buscarSinaisMestreMandou(req.params.idSala);
        }
        res.send(itens);
    }
    catch(ex){
        res.status(500).send(ex.message);
    }  
}

async function obterPorcentagemPorItem(req: any, res: any) { 
    try{
        const dao = new HistoricoDAO(mongoDB, "Historico");
        let registrosHistorico = await dao.obterPorcentagemPorItem(req.params.idSala, req.params.idItem);

        var registrosErro = registrosHistorico.filter(function (e: any) {
            return e.acerto == "true"
        });

        var registrosAcerto = registrosHistorico.filter(function (e: any) {
            return e.acerto == "false";
        });

       let quantidadeAcertos = Object.keys(registrosAcerto).length;
       let quantidadeErros = Object.keys(registrosErro).length;
       let total = quantidadeAcertos + quantidadeErros;
       let porcentagem = ((quantidadeAcertos / total) * 100) + ' %'
       
        res.send(porcentagem);

    }
    catch(ex){
        res.status(500).send(ex.message);
    }  
}

async function obterPorcentagemPorAluno(req: any, res: any) { 
    try{
        const dao = new HistoricoDAO(mongoDB, "Historico");
        let registrosHistorico = await dao.obterPorcentagemPorAluno(req.params.idSala, req.params.idUsuario);

        var registrosErro = registrosHistorico.filter(function (e: any) {
            return e.acerto == "true"
        });

        var registrosAcerto = registrosHistorico.filter(function (e: any) {
            return e.acerto == "false";
        });

       let quantidadeAcertos = Object.keys(registrosAcerto).length;
       let quantidadeErros = Object.keys(registrosErro).length;
       let total = quantidadeAcertos + quantidadeErros;
       let porcentagem = ((quantidadeAcertos / total) * 100) + ' %'
       
        res.send(porcentagem);

    }
    catch(ex){
        res.status(500).send(ex.message);
    }  
}

async function obterMelhoresAlunos(req: any, res: any) { 
    try{
        const dao = new HistoricoDAO(mongoDB, "Historico");
        let historicosPorSala = await dao.obterMelhoresAlunos(req.params.idSala);     
        res.send(historicosPorSala);
    }
    catch(ex){
        res.status(500).send(ex.message);
    }  
}
//#endregion

//#region Requisições POST

async function criar(req: any, res: any) {
    try{  
        let historico = new Historico();    
        historico.idSala = req.body.idSala;
        historico.idUsuario = req.body.idUsuario;
        historico.idItem = req.body.idItem;
        historico.tipoJogo = req.body.tipoJogo;
        historico.acerto = req.body.acerto;
        historico.data = new Date();

        const dao = new HistoricoDAO(mongoDB,'Historico');
        let resultado = await dao.criar(historico);  

        if(req.body.acerto == "true"){
            atualizarUsuario(req.body.idUsuario);        
        }
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex.message);
    }  
}

//#endregion

//#region Métodos

async function buscarPerguntasQuiz(idSala: any){
    const daoQuiz = new QuizDAO(mongoDB, "Quiz");
    const itens = (await daoQuiz.obterPeloItem(idSala)).perguntas;
    return itens;
}

async function buscarSinaisMeteoro(idSala: any){
    const daoMeteoro = new MeteoroDAO(mongoDB, "Meteoro");
    const itens = (await daoMeteoro.obterPeloItem(idSala)).descricao;
    return itens;
}

async function buscarSinaisMestreMandou(idSala: any){
    const daoMeteoro = new MestreMandouDAO(mongoDB, "MestreMandou");
    const itens = (await daoMeteoro.obterPeloItem(idSala)).sinais;
    return itens;
}

async function atualizarUsuario(idUsuario: any) {
    const dao = new UsuarioDAO(mongoDB,'Usuarios');
    let libracoinsPorAcerto = 10;
    let usuario = await dao.obterPeloId(idUsuario); 
    usuario.libracoins = usuario.libracoins + libracoinsPorAcerto;
    let resultado = await dao.atualizar(idUsuario, usuario);  
}
//#endregion