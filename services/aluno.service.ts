import { BaseDao } from "../core/baseDAO.core";
import { Aluno } from "../models/aluno";

export class AlunoDAO extends BaseDao<Aluno>{

    alunosPorProfessor(idProfessor: string){
            // logica aqui

    }

    rendimentoJogoAluno(idAluno: string,idSala: string){
        // lógica aqui

    }

}