var express = require('express');
var router = express.Router();
var testeService = require('services/sala.service');
// routes
router.get('/mongo', mongo_teste);
router.put('/atualizar', atualizar);
router.get('/:_id', testeById);
router.delete('/deletar', deletar);

module.exports = router;

function mongo_teste(req: any, res: any) {
    res.send('Hello');
    // testeService.listJogos()
    //     .then((data: any) => {
    //         res.send(data);
    //     })
    //     .catch(function (err: any) {
    //         res.status(400).send(err);
    //     });
}

function testeById(req: any, res: any) {     
    testeService.getById(req.params._id)
        .then((data: any) => {
            res.send(data);
        })
        .catch(function (err: any) {
            res.status(400).send(err);
        });
}

function deletar(req: any, res: any) {
    testeService.delete(req.body._id)
    .then((data: any) => {
        res.send(data);
    })
    .catch(function (err: any) {
        res.status(400).send(err);
    });
}

function atualizar(req: any, res: any) {
    testeService.update(req.body)
        .then((data: any) => {
            res.send(data);
        })
        .catch(function (err: any) {
            res.status(400).send(err);
    });
}


