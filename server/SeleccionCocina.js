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
    res.sendFile(path.resolve('../public/SeleccionCocina.html'));
    // } else {
    //     res.sendfile(__dirname + '/public/Login.html');
    // }    
});

module.exports = router;