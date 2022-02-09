import { Aluno } from './aluno';

export class Sala {    
    _id: string;
    codigo: number;
    descricao: string;
    status: boolean;
    tipoJogo: number;
    alunos: Array<Aluno>
    dataCriacao: Date;
}