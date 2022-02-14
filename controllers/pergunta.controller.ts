
//#region Importações
import { Perguntas } from "../models/perguntas";
import { PerguntasDAO } from "../services/perguntas.service";
import { Alternativa } from "../models/alternativa";
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
router.get('/:_id', autenticacao, obterPergunta);
router.get('/obterPerguntasPorClasse/:classe', autenticacao, obterPerguntasPorClasse);
router.get('/obterQuantidade/:classe', autenticacao, obterQuantidade);
router.post('/', autenticacao, novaPergunta)
router.post('/obterPerguntasEmLote', autenticacao, obterPerguntasEmLote);

module.exports = router;
//#endregion

//#region Requisições GET

async function obterPergunta(req: any, res: any) {
    const dao = new PerguntasDAO(mongoDB,'Perguntas'); 
    let resultado = await dao.obterPeloId(req.params._id);  
    res.send(resultado);
}

async function obterQuantidade(req: any, res: any) {
    const dao = new PerguntasDAO(mongoDB,'Perguntas'); 
    let resultado = await dao.obterPerguntasPorClasse(req.params.classe);  
    var quantidade = 0;
    resultado.forEach(() => {
        quantidade++;
    });
    res.send({quantidade});
}

async function obterPerguntasPorClasse(req: any, res: any) {
    const dao = new PerguntasDAO(mongoDB,'Perguntas');  
    let resultado = await dao.obterPerguntasPorClasse(req.params.classe);   
    res.send(resultado);
}

//#endregion

//#region Requisições POST
async function novaPergunta(req: any, res: any) {
    const dao = new PerguntasDAO(mongoDB,'Perguntas');
    let pergunta = new Perguntas();
    pergunta.descricao = req.body.descricao;
    pergunta.classe = req.body.classe;
    pergunta.idProfessor = req.body.idProfessor;
    pergunta.alternativas = criarAlternativas(req.body.alternativas);      
    let resultado = await dao.criar(pergunta);    
    res.send(resultado);
}

async function obterPerguntasEmLote(req: any, res: any) {
    const dao = new PerguntasDAO(mongoDB,'Perguntas');
    let resultado = await dao.obterPerguntasEmLote(req.body);
    res.send(resultado);
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







