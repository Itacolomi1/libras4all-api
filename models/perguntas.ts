import { Alternativa } from "./alternativa";

export class Perguntas {
    descricao: string;
    classe: string;
    idProfessor: string;
    caminhoImagem: string;
    alternativas: Array<Alternativa>
}