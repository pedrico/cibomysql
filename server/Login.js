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
    //if (req.session.usuario != null) {
    res.sendFile(path.resolve('../public/Login.html'));
    // } else {
    //     res.sendfile(__dirname + '/public/Login.html');
    // }    
});

router.post('/login', function (req, res) {
    req.session.usuario = req.body.nombre;
    req.session.save(function () {
        res.send({ redireccionar: '/SeleccionMesa' });
    });
});

router.get('/UsrLogin', function (req, res) {
    console.log("Get login");
    var SesionUsuario = { usuario: req.session.usuario };
    console.log(SesionUsuario);
    res.send(SesionUsuario);
});
module.exports = router;