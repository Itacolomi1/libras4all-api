import { Professor } from "../models/professor";
import { ProfessorDAO } from "../services/professor.service";

var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();
var mongoDB = require('config/database.ts');
const ObjectID = mongoDB.ObjectID();
mongoDB.connect();

declare global{
  var conn: any;
  var collection: any;
}

// routes
router.get('/', listar);
router.get('/:_id', getById);
router.post('/', criar);
router.post('/authenticate', authenticateUser)
router.put('/', atualizar);
router.delete('/:_id', deletar);

module.exports = router;

async function criar(req: any, res: any) {        
  let professor = new Professor();   
  professor.nome = req.body.nome;
  professor.email = req.body.email;
  professor.password = req.body.password;

  const dao = new ProfessorDAO(mongoDB,'Professores');
  let result = await dao.create(professor); 
  res.send(result);
}

async function listar(req: any, res: any) {       
  let user = new Professor();   
  const dao = new ProfessorDAO(mongoDB,'Professores');
  let result = await dao.list(user);  
  res.send(result);
}

async function getById(req: any, res: any) { 
  const dao = new ProfessorDAO(mongoDB,'Professores');    
  let result = await dao.getById(req.params._id );  
  res.send(result);   
}

async function deletar(req: any, res: any) {
  const dao = new ProfessorDAO(mongoDB,'Professores');
  let result = await dao.delete(req.params._id );  
  res.send(result);
}

async function atualizar(req: any, res: any) {
  let user = new Professor(); 
  user._id = req.body._id;
  user.nome = req.body.nome;
  user.email = req.body.email;
  user.password = bcrypt.hashSync(req.body.password, 10);
       
  const dao = new ProfessorDAO(mongoDB,'Professores');
  let result = await dao.update(req.body._id, user);  
  res.send(result);
}

function authenticateUser(req: any, res: any) {
  const dao = new ProfessorDAO(mongoDB, "Professores");
  dao.authenticate(req.body.email, req.body.senha)
  .then(function (response: any) {
    if (response) {      
      res.send({ userId: response.userId, token: response.token })                
    } else {
      res.status(401).send('Usuário e/ou senha inválidos')
    }
  })
  .catch(function (err: any) {
    res.status(400).send(err)
  })
}