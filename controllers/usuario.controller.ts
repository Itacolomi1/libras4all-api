//#region Importações
import { Usuario } from "../models/usuario";
import { UsuarioDAO } from "../services/usuario.service";

var express = require('express');
var router = express.Router();
var mongoDB = require('config/database.ts');
var bcrypt = require('bcryptjs');
mongoDB.connect();

declare global{
    var conn: any;
    var collection: any;
}

//#endregion

//#region Rotas

router.get('/', listar);
router.get('/:_id', obterUsuario);
router.get('/autenticar', autenticar);
router.post('/', criar);
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

async function autenticar(req: any, res: any) {
    try{
        let usuario = new Usuario(); 
        usuario._id = req.body._id;
        usuario.senha = bcrypt.hashSync(req.body.senha, 10);

        const dao = new UsuarioDAO(mongoDB, "Usuarios");
        let resultado = await dao.autenticar(usuario._id, usuario.senha);  
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
        let usuario = new Usuario();    
        usuario.nome = req.body.nome;
        usuario.email = req.body.email;
        usuario.senha = bcrypt.hashSync(req.body.senha, 10);

        const dao = new UsuarioDAO(mongoDB,'Usuarios');
        let resultado = await dao.criar(usuario);  
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
        usuario.senha = bcrypt.hashSync(req.body.senha, 10);

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

  
