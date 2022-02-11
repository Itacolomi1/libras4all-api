//#region Importações
import { Professor } from "../models/professor";
import { ProfessorDAO } from "../services/professor.service";

var hash = require('object-hash');
var express = require('express');
var router = express.Router();
var mongoDB = require('config/database.ts');
mongoDB.connect();

declare global{
  var conn: any;
  var collection: any;
}
//#endregion

//#region Rotas

router.get('/', listar);
router.get('/:_id', obterProfessor);
router.post('/', criar);
router.post('/login', login)
router.put('/', atualizar);
router.delete('/:_id', deletar);

module.exports = router;

//#endregion

//#region Requisições GET

async function listar(req: any, res: any) {    
  try {   
    const dao = new ProfessorDAO(mongoDB, 'Professores');
    let resultado = await dao.listar();  
    res.send(resultado);
  }
  catch(ex){
    res.status(500).send(ex);
  }  
}

async function obterProfessor(req: any, res: any) { 
  try {   
    const dao = new ProfessorDAO(mongoDB,'Professores');    
    let resultado = await dao.obterPeloId(req.params._id );  
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
    var emailValidado = await validarEmail(req.body.email);
    if(emailValidado){
      let professor = new Professor();   
      professor.nome = req.body.nome;
      professor.email = req.body.email;
      professor.senha = hash(req.body.senha);

      const dao = new ProfessorDAO(mongoDB,'Professores');
      let resultado = await dao.criar(professor); 
      res.send(resultado);
    }
    else{
      throw new Error("Email já cadastrado!");
    }
  }
  catch(ex){
    res.status(500).send(ex.message);
  }  
}

async function login(req: any, res: any) {
  try{
    const dao = new ProfessorDAO(mongoDB, "Professores");
    var senhaHash = hash(req.body.senha);

    let resultado = await dao.autenticar(req.body.email, senhaHash);  
    res.send(resultado);
  }
  catch(ex){
    res.status(500).send(ex);
  }
}
//#endregion

//#region Requisições PUT

async function atualizar(req: any, res: any) {
  try{
    let professor = new Professor(); 
    professor._id = req.body._id;
    professor.senha = hash(req.body.senha);
        
    const dao = new ProfessorDAO(mongoDB,'Professores');
    let resultado = await dao.atualizar(req.body._id, professor);  
    res.send(resultado);
  }
  catch(ex){
    res.status(500).send(ex.message);
  } 
}

//#endregion

//#region Requisições DELETE

async function deletar(req: any, res: any) {
  try{
    const dao = new ProfessorDAO(mongoDB,'Professores');
    let resultado = await dao.excluir(req.params._id );  
    res.send(resultado);
  }
  catch(ex){
    res.status(500).send(ex);
  } 
}

//#endregion

//#region Métodos
async function validarEmail(email: any){
  const dao = new ProfessorDAO(mongoDB,'Professores');
  let resultado = await dao.obterPeloEmail(email); 
  return resultado === undefined;
}
//#endregion
