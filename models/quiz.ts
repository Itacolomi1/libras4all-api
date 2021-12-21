import { Jogo } from "./jogo";
import { PerguntasQuiz } from "./perguntasQuiz";

export class Quiz extends Jogo {
    id_sala: string;
    perguntasQuiz: Array<PerguntasQuiz>;
}