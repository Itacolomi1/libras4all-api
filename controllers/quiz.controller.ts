//#region Importações

import { Quiz } from "../models/quiz";
import { PerguntasDAO } from "../services/perguntas.service";
import { QuizDAO } from "../services/quiz.service";

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
router.post('/', criar);

module.exports = router;

//#endregion

//#region Requisições POST
async function criar(req: any, res: any) {
    const dao = new QuizDAO(mongoDB,'Quiz');
    const perguntasDAO = new PerguntasDAO(mongoDB,'Perguntas');

    let quiz = new Quiz();
    quiz.id_sala = req.body.idSala;
    quiz.perguntasQuiz = await perguntasDAO.obterPerguntasEmLote(req.body);

    let result = await dao.criar(quiz);
    res.send(result);
}
//#endregion








