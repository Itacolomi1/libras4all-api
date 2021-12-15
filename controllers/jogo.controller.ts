
import { QuizDAO } from "../services/perguntas.service";



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



module.exports = router;


async function getQuestionsbyClass(req: any, res: any) {
    const dao = new QuizDAO(mongoDB,'Perguntas');
   
    let result = await dao.getQuestionsbyClass(req.params.classe);
    
    res.send(result);
}




