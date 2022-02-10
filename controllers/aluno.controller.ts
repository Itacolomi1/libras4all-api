import { Aluno } from "../models/aluno";
import { AlunoDAO } from "../services/aluno.service";

var express = require('express');
var router = express.Router();
var mongoDB = require('config/database.ts');
const ObjectID = mongoDB.ObjectID();
mongoDB.connect();

declare global{
    var conn: any;
    var collection: any;
}

// routes
router.get('/listar', listar);
router.post('/alunosPorProfessor',alunosPorProfessor )
router.post('/rendimentoAluno',rendimentoJogoAluno)


module.exports = router;

async function listar(req: any, res: any) {     
   
    let jogo = new Aluno(); 
   
    const dao = new AlunoDAO(mongoDB,'Alunos');

    let result = await dao.list(jogo);
   
    res.send(result);
}

async function alunosPorProfessor(req: any, res: any){
    const dao = new AlunoDAO(mongoDB,'Alunos');
   
    let result = await dao.alunosPorProfessor(req.body._id );
    
    res.send(result);
}

async function salasPorAluno(req: any, res: any){
    const dao = new AlunoDAO(mongoDB,'Alunos');

    let result = await dao.alunosPorProfessor(req.params._id );

    res.send(result);
}

async function rendimentoJogoAluno(req: any, res: any){
    const dao = new AlunoDAO(mongoDB,'Alunos');

    let result = await dao.rendimentoJogoAluno(req.body.idAluno,req.body.idSala);

    res.send(result);
}


