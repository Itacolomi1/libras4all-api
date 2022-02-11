
//#region Importações
import { Perguntas } from "../models/perguntas";
import { PerguntasDAO } from "../services/perguntas.service";
import { Alternativa } from "../models/alternativa";

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
router.get('/:_id', obterPergunta);
router.get('/obterPerguntasPorClasse/:classe', obterPerguntasPorClasse);
router.post('/', novaPergunta)
router.post('/obterPerguntasEmLote', obterPerguntasEmLote);

module.exports = router;
//#endregion

//#region Requisições GET

async function obterPergunta(req: any, res: any) {
    const dao = new PerguntasDAO(mongoDB,'Perguntas'); 
    let result = await dao.obterPeloId(req.params._id);  
    res.send(result);
}

async function obterPerguntasPorClasse(req: any, res: any) {
    const dao = new PerguntasDAO(mongoDB,'Perguntas');  
    let result = await dao.obterPerguntasPorClasse(req.params.classe);   
    res.send(result);
}

//#endregion

//#region Requisições POST
async function novaPergunta(req: any, res: any) {
    const dao = new PerguntasDAO(mongoDB,'Perguntas');
    let pergunta = new Perguntas();
    pergunta.descricao = req.body.descricao;
    pergunta.classe = req.body.classe;
    pergunta.alternativas = criarAlternativas(req.body.alternativas);      
    let result = await dao.criar(pergunta);    
    res.send(result);
}

async function obterPerguntasEmLote(req: any, res: any) {
    const dao = new PerguntasDAO(mongoDB,'Perguntas');
    let result = await dao.obterPerguntasEmLote(req.body);
    res.send(result);
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







