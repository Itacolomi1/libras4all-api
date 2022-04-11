//#region Importações
import { Sala } from "../models/sala";
import { ServiceSalaDAO } from "../services/sala.service";
import { HistoricoDAO } from "../services/historico.service";
import autenticacao from "../middleware/autenticacao"
import { UsuarioDAO } from "../services/usuario.service";

var express = require('express');
var router = express.Router();
var mongoDB = require('config/database.ts');

declare global{
    var conn: any;
    var collection: any;
}
//#endregion

//#region Rotas
router.get('/', autenticacao, listarSalas);
router.get('/:_id', autenticacao, obterSala);
router.get('/listarSalasProfessor/:_id', autenticacao, listarSalasProfessor);
router.get('/listarAlunos/:_id', autenticacao, listarAlunos);
router.get('/listarSalasProfessorAluno/:idProfessor/:idAluno', autenticacao, listarSalasProfessorAluno);
router.get('/validarCodigo/:codigo', autenticacao, validarCodigo);
router.get('/listarSalasAluno/:_id', autenticacao, listarSalasAluno);
router.get('/obterPontuacao/:idSala/:idAluno', autenticacao, obterPontuacao);
router.get('/obterAlunosPorProfessor/:idProfessor', autenticacao, obterAlunosPorProfessor);
router.post('/', autenticacao, criar);
router.put('/', autenticacao, atualizar);
router.put('/adicionarAluno', autenticacao, adicionarAluno);
router.delete('/:_id', autenticacao, deletar);

module.exports = router;
//#endregion

//#region Requisições GET

async function listarSalas(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new ServiceSalaDAO(conexao, "Salas");
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

async function obterSala(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{ 
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});   
        const dao = new ServiceSalaDAO(conexao,"Salas");
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

async function obterAlunosPorProfessor(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try {  
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true}); 
        const dao = new ServiceSalaDAO(conexao,'Salas');    
        let resultado = await dao.listarSalasProfessor(req.params.idProfessor);
        let alunos = new Set();  
        await Promise.all(resultado.map(async (dado: any) => {           
            await Promise.all(dado.alunos.map(async (element: any) => {
            alunos.add(element._id)
            })); 
        }));
        res.send(Array.from(alunos.values()));
    } 
    catch(ex){
      res.status(500).send(ex.message);
    } 
    finally{
        await conexao.close();
    }  
}

async function listarSalasProfessor(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new ServiceSalaDAO(conexao, "Salas");
        let resultado = await dao.listarSalasProfessor(req.params._id);
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex);
    } 
    finally{
        await conexao.close();
    } 
}

async function listarSalasProfessorAluno(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new ServiceSalaDAO(conexao, "Salas");
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
    finally{
        await conexao.close();
    }  
}

async function listarSalasAluno(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new ServiceSalaDAO(conexao, "Salas");
        let resultado = await dao.listar();
        let salas = new Array;        

        resultado.forEach((element: any) => {             
            if(element.alunos.find((e: any) => e._id == req.params._id)){
                salas.push(element)
            }            
        });

        res.send(salas);
    }
    catch(ex){
        res.status(500).send(ex);
    } 
    finally{
        await conexao.close();
    } 
}

async function listarAlunos(req: any, res: any) { 
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new ServiceSalaDAO(conexao,"Salas");
        let resultado = await dao.obterPeloId(req.params._id); 
        
        let alunos = resultado.alunos;
        res.send(alunos); 
    }
    catch(ex){
        res.status(500).send(ex);
    } 
    finally{
        await conexao.close();
    } 
}

async function validarCodigo(req: any, res: any) {
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new ServiceSalaDAO(conexao,"Salas");
        let resultado = await dao.obterPeloCodigo(req.params.codigo); 
        res.send(resultado); 
    }
    catch(ex){
        res.status(500).send(ex);
    }  
    finally{
        await conexao.close();
    }  
}

async function obterPontuacao(req: any, res: any) {
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new ServiceSalaDAO(conexao, "Salas");
        let resultado = await dao.obterPeloId(req.params.idSala); 
        let aluno = new Array;
        resultado.alunos.forEach((element: any) => {      
            if((element._id == req.params.idAluno)){
                aluno.push(element)
            }            
        });

        res.send(aluno); 
    }
    catch(ex){
        res.status(500).send(ex.message);
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
        let sala = new Sala(); 
        sala.codigo = obterCodigo(1000, 9999);
        sala.descricao = req.body.descricao;
        sala.status = false;
        sala.tipoJogo = req.body.tipoJogo;
        sala.dataCriacao = new Date();
        sala.alunos = [];
        sala.idProfessor = req.body.idProfessor;

        const dao = new ServiceSalaDAO(conexao,"Salas");
        let resultado = await dao.criar(sala);  
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex)
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
        let sala = new Sala(); 
        sala.status = req.body.ativa;
        
        const dao = new ServiceSalaDAO(conexao,'Salas');
        let resultado = await dao.atualizar(req.body._id, sala);  
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex)
    }    
    finally{
        await conexao.close();
    }  
}

async function adicionarAluno(req: any, res: any){
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});
        const dao = new ServiceSalaDAO(conexao,'Salas');
        const usuarioDao = new UsuarioDAO(conexao,'Usuarios');
        var vagaReservada = false;

        let sala = await dao.obterPeloId(req.body.idSala); 
      
        await Promise.all(sala.alunos.map(async (dado: any) => {  
            if(dado._id == req.body.idAluno){
                console.log('entrou')
                vagaReservada = true;
            } 
        }));

        if(!vagaReservada){
            let usuario = await usuarioDao.obterPeloId(req.body.idAluno);      
    
            let resultado = await dao.adicionarAluno(req.body.idSala, req.body.idAluno, usuario.nome, usuario.email, usuario.nickname);  
            res.send(resultado);
        }   
        else{
            throw new Error('{"mensagem": "Aluno já está na sala!"}');
        }
    }
    catch(ex){
        res.status(500).send(ex.message)
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
        const dao = new ServiceSalaDAO(conexao,'Salas');
        const daoHistorico = new HistoricoDAO(conexao, "Historico");

        let resultado = await dao.excluir(req.params._id );
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex)
    }  
    finally{
        await conexao.close();
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