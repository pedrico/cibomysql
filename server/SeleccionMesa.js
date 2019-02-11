var express = require('express');

var router = express.Router();
var con;
var path;
var nombreArchivo;
var session;

router.use(function variablesGlobales(req, res, next) {
  console.log("obteniendo conexion");
  con = req.app.get('con');
  path = req.app.get('path');
  nombreArchivo = req.app.get('nombreArchivo');;
  session = req.app.get('session');
  console.log("conexion obtenida");
  next();
});

router.get('/', function (req, res) {
  console.log('Server seleccion mesa ');
  console.log(req.session.usuario);
  if (req.session.usuario != null) {
    console.log('If');
    res.sendFile(path.resolve('../public/SeleccionMesa.html'));
  } else {
    console.log('Else');
    res.sendfile(path.resolve('../public/Login.html'));
  }
});

router.post('/', function (req, res) {
  req.session.NumeroMesa = req.body.NumeroMesa;
  req.session.Origen = 2;
  console.log(req.session.NumeroMesa);
  res.send({ redireccionar: '/Categoria' });
});


module.exports = router;




