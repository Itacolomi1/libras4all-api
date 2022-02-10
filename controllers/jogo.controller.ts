

import { Quiz } from "../models/quiz";
import { PerguntasDAO } from "../services/perguntas.service";
import { QuizDAO } from "../services/quiz.service";
import { Jogo } from "../models/jogo";

var express = require('express');
var router = express.Router();
// var testeService = require('services/sala.service');
var mongoDB = require('config/database.ts');
const ObjectID = mongoDB.ObjectID();
mongoDB.connect();



declare global{
    var conn: any;
    var collection: any;
}


router.get('/perguntaClasse/:classe', getQuestionsbyClass);
router.post('/perguntasBatch', getQuestionsBatch);
router.post('/createQuiz', createQuiz);
router.get('/listar', listar);
router.post('/criar', criar);
router.put('/atualizar', atualizar);
router.get('/:_id', getById);
router.delete('/deletar/:_id', deletar);


module.exports = router;



async function getQuestionsbyClass(req: any, res: any) {
    const dao = new PerguntasDAO(mongoDB,'Perguntas');
   
    let result = await dao.getQuestionsbyClass(req.params.classe);
    
    res.send(result);
}

async function getQuestionsBatch(req: any, res: any) {
    const dao = new PerguntasDAO(mongoDB,'Perguntas');

    let result = await dao.getQuestionsBatch(req.body);

    res.send(result);

}

async function createQuiz(req: any, res: any) {
    const dao = new QuizDAO(mongoDB,'Quiz');
    const perguntasDao = new PerguntasDAO(mongoDB,'Perguntas');

    let quiz = new Quiz();
    quiz.id_sala = req.body.idSala;
    quiz.perguntasQuiz = await perguntasDao.getQuestionsBatch(req.body);

    let result = await dao.create(quiz);

    res.send(result);

}



async function listar(req: any, res: any) {     
   
    let jogo = new Jogo(); 
   
    const dao = new ServiceExampleDAO(mongoDB,'Jogo');

    let result = await dao.listar();
   
    res.send(result);
}

async function criar(req: any, res: any) {     
   
    let jogo = new Jogo(); 
    
    jogo.classe = req.body.classe;
    jogo.nome = req.body.nome;

    const dao = new ServiceExampleDAO(mongoDB,'Jogo');

    let result = await dao.criar(jogo);
   
    res.send(result);
}

async function getById(req: any, res: any) {     

    const dao = new ServiceExampleDAO(mongoDB,'Jogo');

    let result = await dao.obterPeloId(req.params._id );
   
    res.send(result);
   
}

async function deletar(req: any, res: any) {
    const dao = new ServiceExampleDAO(mongoDB,'Jogo');

    let result = await dao.excluir(req.params._id );
   
    res.send(result);
}

async function atualizar(req: any, res: any) {
    let jogo = new Jogo(); 
    jogo.classe = req.body.classe;
    jogo.nome = req.body.nome;
    
    const dao = new ServiceExampleDAO(mongoDB,'Jogo');

    let result = await dao.atualizar(req.body._id,jogo);
   
    res.send(result);
}



