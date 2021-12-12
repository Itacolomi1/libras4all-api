import { User } from "../models/user";
import { ServiceExampleDAO } from "../services/user.service";

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

async function criar(req: any, res: any) {     
   
    let usuario = new User(); 
    
    usuario.nome = req.body.nome;
    usuario.email = req.body.email;
    usuario.password = req.body.password;

    const dao = new ServiceExampleDAO(mongoDB,'Users');

    let result = await dao.create(usuario);
   
    res.send(result);
}

async function listar(req: any, res: any) {     
   
    let user = new User(); 
   
    const dao = new ServiceExampleDAO(mongoDB,'Users');

    let result = await dao.list(user);
   
    res.send(result);
}

async function getById(req: any, res: any) {     

    const dao = new ServiceExampleDAO(mongoDB,'Users');

    let result = await dao.getById(req.params._id );
   
    res.send(result);
   
}

async function deletar(req: any, res: any) {
    const dao = new ServiceExampleDAO(mongoDB,'Users');

    let result = await dao.delete(req.params._id );
   
    res.send(result);
}

async function atualizar(req: any, res: any) {
    let user = new User(); 
    user._id = req.body._id;
    user.nome = req.body.nome;
    user.email = req.body.email;
    user.password = req.body.password;
    
    
    const dao = new ServiceExampleDAO(mongoDB,'Users');

    let result = await dao.update(req.body._id,user);
   
    res.send(result);
}
