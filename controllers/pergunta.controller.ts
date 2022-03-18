
//#region Importações
import { Perguntas } from "../models/perguntas";
import { PerguntasDAO } from "../services/perguntas.service";
import { Alternativa } from "../models/alternativa";
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
router.get('/:_id', autenticacao, obterPergunta);
router.get('/obterPerguntasPorClasse/:classe', autenticacao, obterPerguntasPorClasse);
router.get('/obterQuantidade/:classe', autenticacao, obterQuantidade);
router.get('/obterQuantidadeCustomizada/:_id', autenticacao, obterQuantidadeCustomizada);
router.post('/', autenticacao, novaPergunta)
router.post('/obterPerguntasEmLote', autenticacao, obterPerguntasEmLote);

module.exports = router;
//#endregion

//#region Requisições GET

async function obterPergunta(req: any, res: any) {
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({ useUnifiedTopology: true });
        const dao = new PerguntasDAO(conexao,'Perguntas'); 
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

async function obterQuantidade(req: any, res: any) {
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({ useUnifiedTopology: true });
        const dao = new PerguntasDAO(conexao,'Perguntas'); 
        let resultado = await dao.obterPerguntasPorClasse(req.params.classe);  
        var quantidade = 0;
        resultado.forEach(() => {
            quantidade++;
        });
        res.send({quantidade});
    }
    catch(ex){
        res.status(500).send(ex.message);
    } 
    finally{
        await conexao.close();
    } 
}

async function obterQuantidadeCustomizada(req: any, res: any) {
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({ useUnifiedTopology: true });
        const dao = new PerguntasDAO(conexao,'Perguntas'); 
        let resultado = await dao.obterPerguntasPorProfessor(req.params._id);  
        var quantidade = 0;
        resultado.forEach(() => {
            quantidade++;
        });
        res.send({quantidade});
    }
    catch(ex){
        res.status(500).send(ex.message);
    } 
    finally{
        await conexao.close();
    } 
}

async function obterPerguntasPorClasse(req: any, res: any) {
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({ useUnifiedTopology: true });
        const dao = new PerguntasDAO(conexao,'Perguntas');  
        let resultado = await dao.obterPerguntasPorClasse(req.params.classe);   
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
async function novaPergunta(req: any, res: any) {
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({ useUnifiedTopology: true });
        const dao = new PerguntasDAO(conexao,'Perguntas');
        let pergunta = new Perguntas();
        pergunta.descricao = req.body.descricao;
        pergunta.classe = req.body.classe;
        pergunta.caminhoImagem = req.body.caminhoImagem;
        pergunta.idProfessor = req.body.idProfessor;
        pergunta.alternativas = criarAlternativas(req.body.alternativas);      
        let resultado = await dao.criar(pergunta);    
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex.message);
    } 
    finally{
        await conexao.close();
    } 
}

async function obterPerguntasEmLote(req: any, res: any) {
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({ useUnifiedTopology: true });
        const dao = new PerguntasDAO(conexao,'Perguntas');
        let resultado = await dao.obterPerguntasEmLote(req.body);
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

function criarAlternativas(array: any) {
    let alternativas = Array<Alternativa>();
    
    array.forEach((element: any) => {
        let alternativa = new Alternativa();
        alternativa.descricao = element.texto;
        alternativa.perguntaCorreta = element.perguntaCorreta;
        alternativas.push(alternativa);
    });
    return alternativas;
}

//#endregion







