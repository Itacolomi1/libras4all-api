//#region Importações
import { Sala } from "../models/sala";
import { ServiceSalaDAO } from "../services/sala.service";

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

router.get('/', listarSalas);
router.get('/:_id', obterSala);
router.get('/listarSalasProfessor/:_id', listarSalasProfessor);
router.get('/obterMelhoresAlunos/:_id', obterMelhoresAlunos);
router.get('/listarSalasProfessorAluno/:idProfessor/:idAluno', listarSalasProfessorAluno);
router.post('/', criar);
router.put('/', atualizar);
router.put('/adicionarAluno', adicionarAluno);
router.delete('/:_id', deletar);

module.exports = router;

//#endregion

//#region Requisições GET

async function listarSalas(req: any, res: any) { 
    try{
        const dao = new ServiceSalaDAO(mongoDB, "Sala");
        let result = await dao.listAll();
        res.send(result);
    }
    catch(ex){
        res.status(500).send(ex);
    }  
}

async function obterSala(req: any, res: any) { 
    try{    
        const dao = new ServiceSalaDAO(mongoDB,'Sala');
        let result = await dao.getById(req.params._id ); 
        res.send(result); 
    }    
    catch(ex){
        res.status(500).send(ex);
    }  
}

async function listarSalasProfessor(req: any, res: any) { 
    try{
        const dao = new ServiceSalaDAO(mongoDB, "Sala");
        let result = await dao.listarSalasProfessor(req.params._id);
        res.send(result);
    }
    catch(ex){
        res.status(500).send(ex);
    }  
}

async function listarSalasProfessorAluno(req: any, res: any) { 
    try{
        const dao = new ServiceSalaDAO(mongoDB, "Sala");
        let result = await dao.listarSalasProfessor(req.params.idProfessor);
        let salas = new Array;        

        result.forEach((element: any) => {  
            let alunos = new Array;    
            
            if(element.alunos.find((e: any) => e._id == req.params.idAluno)){
                salas.push(element)
            }            
            console.log(salas)
        });

        res.send(salas);
    }
    catch(ex){
        res.status(500).send(ex);
    }   
}

async function obterMelhoresAlunos(req: any, res: any) { 
    try{
        const dao = new ServiceSalaDAO(mongoDB,'Sala');
        let result = await dao.getById(req.params._id); 
        
        let alunos = result.alunos;
        let alunosOrdenados = alunos.sort((a, b) => (a.pontuacao < b.pontuacao) ? 1 : -1);
        let melhoresAlunos = alunosOrdenados.slice(0, 5);  
        res.send(melhoresAlunos); 
    }
    catch(ex){
        res.status(500).send(ex);
    }  
}
//#endregion

//#region Requisições POST

async function criar(req: any, res: any) {   
    try{    
        let sala = new Sala(); 
        sala.codigo = obterCodigo(1000, 9999);
        sala.descricao = req.body.descricao;
        sala.status = false;
        sala.tipoJogo = req.body.tipoJogo;
        sala.dataCriacao = new Date();
        sala.alunos = [];
        sala.idProfessor = req.body.idProfessor;

        const dao = new ServiceSalaDAO(mongoDB,'Sala');
        let result = await dao.create(sala);  
        res.send(result);
    }
    catch(ex){
        res.status(500).send(ex)
    }  
}

//#endregion

//#region Requisições PUT

async function atualizar(req: any, res: any) {
    try{
        let sala = new Sala(); 
        sala.descricao = req.body.descricao;
        sala.status = req.body.ativa;
        
        const dao = new ServiceSalaDAO(mongoDB,'Sala');
        let result = await dao.update(req.body._id, sala);  
        res.send(result);
    }
    catch(ex){
        res.status(500).send(ex)
    }      
}

async function adicionarAluno(req: any, res: any){
    try{
        const dao = new ServiceSalaDAO(mongoDB,'Sala');
        let result = await dao.adicionarAluno(req.body.idSala, req.body.idAluno);  
        res.send(result);
    }
    catch(ex){
        res.status(500).send(ex)
    }  
}
//#endregion

//#region Requisições DELETE

async function deletar(req: any, res: any) {
    try{
        const dao = new ServiceSalaDAO(mongoDB,'Sala');
        let result = await dao.delete(req.params._id );
        res.send(result);
    }
    catch(ex){
        res.status(500).send(ex)
    }  
}

//#endregion

//#region Métodos

function obterCodigo(min: any, max: any) {
    min = Math.ceil(min);
    max = Math.floor(max);
  
    const codigoGerado = Math.floor(Math.random() * (max - min)) + min;  
    return codigoGerado;
}

//#endregion