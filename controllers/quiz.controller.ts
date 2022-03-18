//#region Importações
import { Quiz } from "../models/quiz";
import { PerguntasDAO } from "../services/perguntas.service";
import { QuizDAO } from "../services/quiz.service";
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
router.get('/:_id', autenticacao, obterQuiz);
router.get('/obterQuizPorSala/:idSala', autenticacao, obterQuizPorSala);
router.post('/', autenticacao, criar);

module.exports = router;
//#endregion

//#region Requisições GET
async function obterQuiz(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({ useUnifiedTopology: true });
        const dao = new QuizDAO(conexao, "Quiz");
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

async function obterQuizPorSala(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({ useUnifiedTopology: true });
        const dao = new QuizDAO(conexao, "Quiz");
        let resultado = await dao.obterQuizPorSala(req.params.idSala);
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
        await conexao.connect({ useUnifiedTopology: true });
        const dao = new QuizDAO(conexao,'Quiz');
        let quiz = new Quiz();   
        quiz.idSala = req.body.idSala;
        quiz.perguntas = await obterPerguntas(req.body.perguntas, conexao);
        let resultado = await dao.criar(quiz);
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

function obterPerguntasAleatorias(dado:any, conexao:any) {
    const dao = new PerguntasDAO(conexao,'Perguntas');
    var idPerguntas = dao.obterPerguntasAleatorias(dado);
    return idPerguntas;
}

async function obterPerguntas(dados: any, conexao:any){
    const perguntas: any[] = [];
    const dao = new PerguntasDAO(conexao,'Perguntas');
    await Promise.all(dados.map(async (dado: any) => {        
        const res = await obterPerguntasAleatorias(dado, conexao)       
        await Promise.all(res.map(async (element: any) => {
            perguntas.push(element)
        })); 
    }));
    return perguntas;   
}

//#endregion







