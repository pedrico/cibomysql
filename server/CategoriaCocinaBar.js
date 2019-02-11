var express = require('express');

var router = express.Router();
var con;
var path;
var nombreArchivo;

router.use(function variablesGlobales(req, res, next) {
    console.log("obteniendo conexion");
    con = req.app.get('con');
    path = req.app.get('path');
    nombreArchivo = req.app.get('nombreArchivo');;
    console.log("conexion obtenida");
    next();
});

router.get('/', function (req, res) {
    if (req.session.usuario != null) {
        res.sendFile(path.resolve('../public/CategoriaCocinaBar.html'));
    } else {
        res.sendfile(path.resolve('../public/Login.html'));
    }
});

router.get('/Cocina', function (req, res) {
    var sql = `select * from CatCocinaCategoria order by nombre asc;`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

router.get('/Bar', function (req, res) {
    var sql = `select * from CatBarCategoria order by nombre asc;`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

router.post('/CategoriaCocina', function (req, res) {
    req.session.NuevoPlato = null;
    // delete req.session.NuevoPlato;
    req.session.save();
    console.log("Set NuevoPlato = null");
    console.log(req.session);
    res.send({ redireccionar: '/SeleccionCocina' });
});

router.post('/CategoriaBar', function (req, res) {
    req.session.NuevoPlato = null;
    // delete req.session.NuevoPlato;
    req.session.save();
    console.log("Set NuevoPlato = null");
    console.log(req.session);
    res.send({ redireccionar: '/SeleccionBar' });
});



module.exports = router;