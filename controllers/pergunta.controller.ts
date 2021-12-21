
import { PerguntasDAO } from "../services/perguntas.service";



var express = require('express');
var router = express.Router();
// var testeService = require('services/sala.service');
var mongoDB = require('config/database.ts');
const ObjectID = mongoDB.ObjectID();
mongoDB.connect();



declare global{
    var conn: any;
    var collection: any;
}




// routes
router.get('/:_id', getByID);




module.exports = router;


async function getByID(req: any, res: any) {
    const dao = new PerguntasDAO(mongoDB,'Perguntas');
   
    let result = await dao.getById(req.params._id);
    
    res.send(result);
}






