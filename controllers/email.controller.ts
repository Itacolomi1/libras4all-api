//#region Importações
import { Email } from '../models/email';
import { EmailDAO } from "../services/email.service";
import { Usuario } from "../models/usuario";
import { UsuarioDAO } from "../services/usuario.service";
import { Professor } from "../models/professor";
import { ProfessorDAO } from "../services/professor.service";

import * as express from "express";

var hash = require('object-hash');
var router = express.Router();
var mongoDB = require('config/database.ts');

declare global{
    var conn: any;
    var collection: any;
}
//#endregion

//#region Rotas

router.get('/validar/:_id', validar);
router.post('/', enviar);
router.put('/atualizar', atualizar);

module.exports = router;

//#endregion

//#region Requisições GET

async function validar(req: any, res: any) {
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});  
        
        const dao = new EmailDAO(conexao,'HistoricoRecuperarSenha'); 

        let historico = await dao.obterPeloId(req.params._id); 
        
        var dataMaxima = buscarDataMaxima(historico.data);
        var dataAtual = new Date();

        if(dataMaxima < dataAtual){
            throw new Error("Link expirado!");
        }
        else{
            res.status(200).send('Link ativo');
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

//#region Requisições POST

async function enviar(req: any, res: any) {
    console.log('entrou')
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});  
        
        if(req.body.isMobile){
            await configurarEmailUsuario(conexao, req.body._id);
        }
        else{
            await configurarEmailProfessor(conexao, req.body._id);
        }

        res.status(200).send('E-mail enviado com sucesso!');
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
    console.log('teste')
    const conexao = mongoDB.connect();
    try{
        await conexao.connect({poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});  
        
        const dao = new EmailDAO(conexao,'HistoricoRecuperarSenha'); 

        let historico = await dao.obterPeloId(req.body.idHistorico); 

        console.log(historico)
        var novaSenha = req.body.novaSenha;
        let resultado = null;

        if(historico.isMobile){
            resultado = await atualizarUsuario(conexao, historico.idUsuario, novaSenha);
        }
        else{
            resultado = await atualizarProfessor(conexao, historico.idUsuario, novaSenha);
        }

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

//#region Métodos

async function criarLinkRedefinirSenha(conexao: any, idUsuario: string, flag: any){
    const dao = new EmailDAO(conexao,'HistoricoRecuperarSenha'); 

    var emailHistorico = new Email();
    emailHistorico.idUsuario = idUsuario;
    emailHistorico.data = new Date();
    emailHistorico.isMobile = flag;

    let idHistorico = await dao.criarHistorico(emailHistorico);
    var linkRedefinir = "https://libras4all-web.herokuapp.com/RedefinirSenha?req="+ idHistorico;
    return linkRedefinir;
}

function buscarDataMaxima(data: Date){
    console.log(data)
    var MM = data.getMonth();
    var dd = data.getDate();
    var yyyy = data.getFullYear();
    var hh = data.getHours();
    var mm = data.getMinutes() + 15;
    var dataMaxima = new Date(yyyy, MM, dd, hh, mm);
    return dataMaxima;
}

async function atualizarUsuario(conexao: any, idUsuario: string, novaSenha: string){
    const dao = new UsuarioDAO(conexao,'Usuarios'); 

    let usuario = new Usuario(); 
    usuario._id = idUsuario;
    usuario.senha = hash(novaSenha);

    let resultado = await dao.atualizar(idUsuario, usuario);  
    return resultado;
}

async function atualizarProfessor(conexao: any, idProfessor: string, novaSenha: string){
    const dao = new ProfessorDAO(conexao,'Professores');

    let professor = new Professor(); 
    professor._id = idProfessor;
    professor.senha = hash(novaSenha);
    
    let resultado = await dao.atualizar(idProfessor, professor);  
    return resultado;
}

async function configurarEmailUsuario(conexao: any, idUsuario: string){
    const daoUsuario = new UsuarioDAO(conexao,'Usuarios'); 
    let usuario = await daoUsuario.obterPeloId(idUsuario);

    var linkRedefinir = await criarLinkRedefinirSenha(conexao, idUsuario, true);

    await enviarEmail(conexao, usuario.nome, linkRedefinir, usuario.email);    
}

async function configurarEmailProfessor(conexao: any, idProfessor: string){
    const daoProfessor = new ProfessorDAO(conexao,'Professores');
    let professor = await daoProfessor.obterPeloId(idProfessor);

    var linkRedefinir = await criarLinkRedefinirSenha(conexao, idProfessor, false);

    await enviarEmail(conexao, professor.nome, linkRedefinir, professor.email);    
}

async function enviarEmail(conexao: any, nome: string, linkRedefinir: string, email: string) {
    const dao = new EmailDAO(conexao,'HistoricoRecuperarSenha'); 

    let titulo = "Redefinir Senha - Libras4All";       
    
    let mensagem = "Olá, " + nome + "! <br />" +
    "Link para redefinir a senha: " + linkRedefinir + " <br /><br />" +
    "O link ficará ativo por 15 minutos!";

    await dao.enviar(email, titulo, mensagem);    
}
//#endregion