import { Jogo } from "../models/jogo";
import { ServiceExampleDAO } from "../services/exemplo.service";

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
router.get('/listar', listar);
router.post('/criar', criar);
router.put('/atualizar', atualizar);
router.get('/:_id', getById);
router.delete('/deletar/:_id', deletar);

module.exports = router;

async function listar(req: any, res: any) {     
   
    let jogo = new Jogo(); 
   
    const dao = new ServiceExampleDAO(mongoDB,'Jogo');

    let result = await dao.list(jogo);
   
    res.send(result);
}

async function criar(req: any, res: any) {     
   
    let jogo = new Jogo(); 
    
    jogo.classe = req.body.classe;
    jogo.nome = req.body.nome;

    const dao = new ServiceExampleDAO(mongoDB,'Jogo');

    let result = await dao.create(jogo);
   
    res.send(result);
}

async function getById(req: any, res: any) {     

    const dao = new ServiceExampleDAO(mongoDB,'Jogo');

    let result = await dao.getById(req.params._id );
   
    res.send(result);
   
}

async function deletar(req: any, res: any) {
    const dao = new ServiceExampleDAO(mongoDB,'Jogo');

    let result = await dao.delete(req.params._id );
   
    res.send(result);
}

async function atualizar(req: any, res: any) {
    let jogo = new Jogo(); 
    jogo.classe = req.body.classe;
    jogo.nome = req.body.nome;
    
    const dao = new ServiceExampleDAO(mongoDB,'Jogo');

    let result = await dao.update(req.body._id,jogo);
   
    res.send(result);
}


