//#region Importações
import { Usuario } from "../models/usuario";
import { UsuarioDAO } from "../services/usuario.service";
import { ServiceSalaDAO } from "../services/sala.service";
import autenticacao from "../middleware/autenticacao";

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

router.get('/', autenticacao, listar);
router.get('/:_id', autenticacao, obterUsuario);
router.get('/obterNivel/:_id', autenticacao, obterNivel);
router.get('/obterNivel/:_id', autenticacao, obterNivel);
router.get('/ranking/geral', autenticacao, rankingGeral);
router.get('/obterAlunosPorProfessor/:_id', autenticacao, obterAlunosPorProfessor);
router.post('/', criar);
router.post('/login', login);
router.put('/', autenticacao, atualizar);
router.delete('/:_id', autenticacao, deletar);

module.exports = router;

//#endregion

//#region Requisições GET

async function listar(req: any, res: any) {      
    try{ 
        const dao = new UsuarioDAO(mongoDB,'Usuarios');
        let resultado = await dao.listar();  
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex.message);
    } 
}

async function obterUsuario(req: any, res: any) {     
    try{ 
        const dao = new UsuarioDAO(mongoDB,'Usuarios');
        let resultado = await dao.obterPeloId(req.params._id );
        res.send(resultado);
    }
    catch(ex){
      res.status(500).send(ex.message);
    }    
}

async function rankingGeral(req: any, res: any) { 
    try{
        const dao = new UsuarioDAO(mongoDB,"Usuarios");
        let resultado = await dao.listar(); 
        let alunosOrdenados = resultado.sort((a, b) => (a.libracoins < b.libracoins) ? 1 : -1);
        var i = 1;
        let melhoresAlunos: any[] = [];
        
        alunosOrdenados.forEach((element: any) => {
            element.posicao = i;
            melhoresAlunos.push(element);
            i++;
        }); 

        res.send(melhoresAlunos); 
    }
    catch(ex){
        res.status(500).send(ex.message);
    }  
}


async function obterNivel(req: any, res:any) {
    try{
        const idUsuario = req.params._id;
        const dao = new UsuarioDAO(mongoDB, "Usuarios");
        let resultado = await (await dao.obterPeloId(idUsuario)).libracoins;
        let nivel = '';
        
        if(resultado < 50){
            nivel = 'Latão';
        }
        else if(resultado < 100){
            nivel = 'Prata';
        }
        else if(resultado < 200){
            nivel = 'Ouro';
        }
        else if(resultado < 300){
            nivel = 'Âmbar';
        }
        else {
            nivel = 'Platina';
        }

        res.send(nivel);
    }
    catch(ex){
        res.status(500).send(ex.message);
    }
}

async function obterAlunosPorProfessor(req: any, res: any) { 
    try{
        const dao = new ServiceSalaDAO(mongoDB, "Salas");
        let resultado = await dao.listarSalasProfessor(req.params._id);
        let alunosFiltrado = new Set();        

        resultado.forEach((x: any) => {  
            x.alunos.forEach((y: any) => {             
                alunosFiltrado.add(y._id);           
            });           
        });
        res.send(Array.from(alunosFiltrado.values()));
    }
    catch(ex){
        res.status(500).send(ex.message);
    }   
}

//#endregion

//#region Requisições POST

async function criar(req: any, res: any) {
    try{  
        var emailValidado = await validarEmail(req.body.email);
        if(emailValidado){
            let usuario = new Usuario();    
            usuario.nome = req.body.nome;
            usuario.email = req.body.email;
            usuario.senha = hash(req.body.senha);
            usuario.libracoins = 10;

            const dao = new UsuarioDAO(mongoDB,'Usuarios');
            let resultado = await dao.criar(usuario);  
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
        const dao = new UsuarioDAO(mongoDB, "Usuarios");
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
}

//#endregion

//#region Requisições PUT

async function atualizar(req: any, res: any) {
    try{ 
        let usuario = new Usuario(); 
        usuario._id = req.body._id;
        usuario.senha = hash(req.body.senha);

        const dao = new UsuarioDAO(mongoDB,'Usuarios');
        let resultado = await dao.atualizar(req.body._id, usuario);  
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
        const dao = new UsuarioDAO(mongoDB,'Usuarios');
        let resultado = await dao.excluir(req.params._id );  
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex.message);
    }  
}
//#endregion

//#region Métodos
async function validarEmail(email: any){
    const dao = new UsuarioDAO(mongoDB,'Usuarios');
    let resultado = await dao.obterPeloEmail(email); 
    return resultado === undefined;
  }
  //#endregion
