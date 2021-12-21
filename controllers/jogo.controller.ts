
import { Quiz } from "../models/quiz";
import { PerguntasDAO } from "../services/perguntas.service";
import { QuizDAO } from "../services/quiz.service";



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




// routes
router.get('/perguntaClasse/:classe', getQuestionsbyClass);
router.post('/perguntasBatch', getQuestionsBatch);
router.post('/createQuiz', createQuiz);



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




