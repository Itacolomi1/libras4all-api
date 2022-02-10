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
router.get('/listarAlunos/:_id', listarAlunos);
router.get('/obterMelhoresAlunos/:_id', obterMelhoresAlunos);
router.get('/listarSalasProfessorAluno/:idProfessor/:idAluno', listarSalasProfessorAluno);
router.get('/validarCodigo/:idSala/:codigo', validarCodigo);
router.post('/', criar);
router.put('/', atualizar);
router.put('/adicionarAluno', adicionarAluno);
router.delete('/:_id', deletar);

module.exports = router;

//#endregion

//#region Requisições GET

async function listarSalas(req: any, res: any) { 
    try{
        const dao = new ServiceSalaDAO(mongoDB, "Salas");
        let resultado = await dao.listar();
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex);
    }  
}

async function obterSala(req: any, res: any) { 
    try{    
        const dao = new ServiceSalaDAO(mongoDB,"Salas");
        let resultado = await dao.obterPeloId(req.params._id ); 
        res.send(resultado); 
    }    
    catch(ex){
        res.status(500).send(ex);
    }  
}

async function listarSalasProfessor(req: any, res: any) { 
    try{
        const dao = new ServiceSalaDAO(mongoDB, "Salas");
        let resultado = await dao.listarSalasProfessor(req.params._id);
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex);
    }  
}

async function listarSalasProfessorAluno(req: any, res: any) { 
    try{
        const dao = new ServiceSalaDAO(mongoDB, "Salas");
        let resultado = await dao.listarSalasProfessor(req.params.idProfessor);
        let salas = new Array;        

        resultado.forEach((element: any) => {             
            if(element.alunos.find((e: any) => e._id == req.params.idAluno)){
                salas.push(element)
            }            
        });

        res.send(salas);
    }
    catch(ex){
        res.status(500).send(ex);
    }   
}

async function listarAlunos(req: any, res: any) { 
    try{
        const dao = new ServiceSalaDAO(mongoDB,"Salas");
        let resultado = await dao.obterPeloId(req.params._id); 
        
        let alunos = resultado.alunos;
        res.send(alunos); 
    }
    catch(ex){
        res.status(500).send(ex);
    }  
}

async function obterMelhoresAlunos(req: any, res: any) { 
    try{
        const dao = new ServiceSalaDAO(mongoDB,"Salas");
        let resultado = await dao.obterPeloId(req.params._id); 
        
        let alunos = resultado.alunos;
        let alunosOrdenados = alunos.sort((a, b) => (a.pontuacao < b.pontuacao) ? 1 : -1);
        let melhoresAlunos = alunosOrdenados.slice(0, 5);  
        res.send(melhoresAlunos); 
    }
    catch(ex){
        res.status(500).send(ex);
    }  
}

async function validarCodigo(req: any, res: any) {
    try{
        const dao = new ServiceSalaDAO(mongoDB,"Salas");
        let resultado = await dao.obterPeloId(req.params.idSala); 
        res.send(req.params.codigo == resultado.codigo); 
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

        const dao = new ServiceSalaDAO(mongoDB,"Salas");
        let resultado = await dao.criar(sala);  
        res.send(resultado);
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
        
        const dao = new ServiceSalaDAO(mongoDB,'Salas');
        let resultado = await dao.atualizar(req.body._id, sala);  
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex)
    }      
}

async function adicionarAluno(req: any, res: any){
    try{
        const dao = new ServiceSalaDAO(mongoDB,'Salas');
        let resultado = await dao.adicionarAluno(req.body.idSala, req.body.idAluno);  
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex)
    }  
}
//#endregion

//#region Requisições DELETE

async function deletar(req: any, res: any) {
    try{
        const dao = new ServiceSalaDAO(mongoDB,'Salas');
        let resultado = await dao.excluir(req.params._id );
        res.send(resultado);
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