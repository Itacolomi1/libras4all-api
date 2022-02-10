//#region Importações
import { Usuario } from "../models/usuario";
import { UsuarioDAO } from "../services/usuario.service";

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
router.get('/:_id', obterUsuario);
router.get('/obterNivel/:_id', obterNivel);
router.post('/', criar);
router.post('/login', login);
router.put('/', atualizar);
router.delete('/:_id', deletar);

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
        res.status(500).send(ex);
    } 
}

async function obterUsuario(req: any, res: any) {     
    try{ 
        const dao = new UsuarioDAO(mongoDB,'Usuarios');
        let resultado = await dao.obterPeloId(req.params._id );
        res.send(resultado);
    }
    catch(ex){
      res.status(500).send(ex);
    }    
}

async function obterNivel(req: any,res:any) {
    try{
        const idUsuario = req.params._id;
        const dao = new UsuarioDAO(mongoDB, "Usuarios");
        let result = await (await dao.obterPeloId(idUsuario)).nivel;
        res.send(result);
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
            let usuario = new Usuario();    
            usuario.nome = req.body.nome;
            usuario.email = req.body.email;
            usuario.senha = hash(req.body.senha);
            usuario.nivel = "Latão";
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
        let usuario = new Usuario(); 
        usuario._id = req.body._id;
        usuario.senha = hash(req.body.senha);

        const dao = new UsuarioDAO(mongoDB,'Usuarios');
        let resultado = await dao.atualizar(req.body._id, usuario);  
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex);
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
        res.status(500).send(ex);
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
