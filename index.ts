import express from "express";
import cors from "cors";

require('rootpath')(); 

let PORT: number = 0;
var expressJwt = require('express-jwt');
const app = express();

if (!process.env.PORT) {
    console.log('got out for the backdoors');
    PORT = 9090;
}
else{
    PORT  = parseInt(process.env.PORT as string, 10)
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.json());
app.use('/api/usuario',require('./controllers/usuario.controller'));
app.use('/api/teste',require('./controllers/sala.controller'));
app.use('/api/jogo', require('./controllers/jogo.controller'));
app.use('/api/perguntas', require('./controllers/pergunta.controller'));
app.use('/api/sala',require('./controllers/sala.controller'));
app.use('/api/professor',require('./controllers/professor.controller'));

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
});