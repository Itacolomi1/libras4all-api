
import { Perguntas } from "../models/perguntas";
import { PerguntasDAO } from "../services/perguntas.service";



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
router.get('/:_id', getByID);
router.post('/novaPergunta',novaPergunta)




module.exports = router;


async function getByID(req: any, res: any) {
    const dao = new PerguntasDAO(mongoDB,'Perguntas');
   
    let result = await dao.getById(req.params._id);
    
    res.send(result);
}

async function novaPergunta(req: any, res: any) {

    const dao = new PerguntasDAO(mongoDB,'Perguntas');

    let pergunta = new Perguntas();
    pergunta.descricao = req.body.descricao;
    pergunta.classe = req.body.classe;
    pergunta.alternativas = dao.getAlternativas(req.body.alternativas);    
   
    let result = await dao.create(pergunta);
    
    res.send(result);
}







