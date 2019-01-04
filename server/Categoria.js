var express = require('express');

var router = express.Router();
var con;
var path;
var nombreArchivo;

router.use(function variablesGlobales(req,res,next){
    console.log("obteniendo conexion");
    con  = req.app.get('con');
    path  = req.app.get('path');
    nombreArchivo = req.app.get('nombreArchivo');;
    console.log("conexion obtenida");
    next();
});

router.get('/', function (req, res) {
    //if (req.session.usuario != null) {
    res.sendFile(path.resolve('../public/Categoria.html'));
    // } else {
    //     res.sendfile(__dirname + '/public/Login.html');
    // }    
});

router.get('/CategoriaSesionMesa', function (req, res) {
    var SesionMesa = { NumeroMesa: req.session.NumeroMesa };
    res.send(SesionMesa);    
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
    res.send({ redireccionar: '/SeleccionBar' });
});

router.post('/RedireccionarMesa', function (req, res) {
    res.send({ redireccionar: '/SeleccionMesa' });
});

router.post('/RedireccionarOrden', function (req, res) {
    res.send({ redireccionar: '/ResumenOrden' });
});


router.post('/RedireccionarCuentaOrden', function (req, res) {
    res.send({ redireccionar: '/Cuenta' });
});

router.post('/CategoriaCerrarSesion', function (req, res) {
    req.session.NumeroMesa = null;
    req.session.usuario = null;
    res.send({ redireccionar: '/Login' });
});



module.exports = router;