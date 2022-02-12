//#region Importações

import e from "express";
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
router.get('/obterQuizPorSala/:idSala', obterQuizPorSala);
router.post('/', criar);

module.exports = router;

//#endregion

//#region Requisições GET

async function obterQuizPorSala(req: any, res: any) { 
    try{
        const dao = new QuizDAO(mongoDB, "Quiz");
        let resultado = await dao.obterQuizPorSala(req.params.idSala);
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex);
    }  
}

//#endregion

//#region Requisições POST
async function criar(req: any, res: any) {
    try{
        const dao = new QuizDAO(mongoDB,'Quiz');
        let quiz = new Quiz();   
        quiz.idSala = req.body.idSala;
        quiz.perguntas = await obterPerguntas(req.body.perguntas);
        let resultado = await dao.criar(quiz);
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex.message);
    }  
}
//#endregion

//#region Métodos

function obterPerguntasAleatorias(dado:any) {
    const dao = new PerguntasDAO(mongoDB,'Perguntas');
    var idPerguntas = dao.obterPerguntasAleatorias(dado);
    return idPerguntas;
}

async function obterPerguntas(dados: any){
    const perguntas: any[] = [];
    const dao = new PerguntasDAO(mongoDB,'Perguntas');
    await Promise.all(dados.map(async (dado: any) => {        
        const res = await obterPerguntasAleatorias(dado)       
        await Promise.all(res.map(async (element: any) => {
            perguntas.push(element)
        })); 
    }));
    return perguntas;   
}

//#endregion







