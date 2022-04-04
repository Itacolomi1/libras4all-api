//#region Importações
import { Professor } from "../models/professor";
import { ProfessorDAO } from "../services/professor.service";
import autenticacao from "../middleware/autenticacao";

var hash = require('object-hash');
var express = require('express');
var router = express.Router();
var mongoDB = require('config/database.ts');

declare global{
  var conn: any;
  var collection: any;
}
//#endregion

//#region Rotas
router.get('/', autenticacao, listar);
router.get('/:_id', autenticacao, obterProfessor);
router.post('/', criar);
router.post('/login', login)
router.put('/', autenticacao, atualizar);
router.delete('/:_id', autenticacao, deletar);

module.exports = router;
//#endregion

//#region Requisições GET

async function listar(req: any, res: any) {    
  const conexao = mongoDB.connect();
  try {  
    await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true}); 
    const dao = new ProfessorDAO(conexao, 'Professores');
    let resultado = await dao.listar();  
    res.send(resultado);
  }
  catch(ex){
    res.status(500).send(ex);
  } 
  finally{
    await conexao.close();
  } 
}

async function obterProfessor(req: any, res: any) { 
  const conexao = mongoDB.connect();
  try {  
    await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true}); 
    const dao = new ProfessorDAO(conexao,'Professores');    
    let resultado = await dao.obterPeloId(req.params._id );  
    res.send(resultado); 
  } 
  catch(ex){
    res.status(500).send(ex);
  } 
  finally{
    await conexao.close();
  }  
}

//#endregion

//#region Requisições POST

async function criar(req: any, res: any) {    
  const conexao = mongoDB.connect();
  try{  
    await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
    
    let professor = new Professor();   
    professor.nome = req.body.nome;
    professor.email = (req.body.email).toLowerCase();
    professor.senha = hash(req.body.senha);
    professor.dataNascimento = req.body.dataNascimento;

    var emailValidado = await validarEmail(professor.email, conexao);
    
    if(emailValidado){
      const dao = new ProfessorDAO(conexao,'Professores');
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
  finally{
    await conexao.close();
  }  
}

async function login(req: any, res: any) {
  const conexao = mongoDB.connect();
  try{
    await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
    const dao = new ProfessorDAO(conexao, "Professores");
    var senhaHash = hash(req.body.senha);
    let resultado = await dao.autenticar(req.body.email, senhaHash);  
    
    if(resultado.token == undefined){
      res.status(400).send(resultado.erro);
    }
    else{
      res.send(resultado);
    }
  }
  catch(ex){
    res.status(500).send(ex.message);
  }
  finally{
    await conexao.close();
  }
}
//#endregion

//#region Requisições PUT

async function atualizar(req: any, res: any) {
  const conexao = mongoDB.connect();
  try{
    await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
    let professor = new Professor(); 
    professor._id = req.body._id;
    professor.senha = hash(req.body.senha);
        
    const dao = new ProfessorDAO(conexao,'Professores');
    let resultado = await dao.atualizar(req.body._id, professor);  
    res.send(resultado);
  }
  catch(ex){
    res.status(500).send(ex.message);
  }
  finally{
    await conexao.close();
  } 
}

//#endregion

//#region Requisições DELETE

async function deletar(req: any, res: any) {
  const conexao = mongoDB.connect();
  try{
    await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
    const dao = new ProfessorDAO(conexao,'Professores');
    let resultado = await dao.excluir(req.params._id );  
    res.send(resultado);
  }
  catch(ex){
    res.status(500).send(ex);
  } 
  finally{
    await conexao.close();
  }
}

//#endregion

//#region Métodos
async function validarEmail(email: any, conexao: any){
  const dao = new ProfessorDAO(conexao,'Professores');
  let resultado = await dao.obterPeloEmail(email); 
  return resultado === undefined;
}
//#endregion
