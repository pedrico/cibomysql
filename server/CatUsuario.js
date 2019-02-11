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
        res.sendFile(path.resolve('../public/CatUsuario.html'));
    } else {
        res.sendfile(path.resolve('../public/Login.html'));
    }
});

router.get('/usuario', function (req, res) {
    var sql = `select id, nombre, apellido, usuario from CatUsuario;`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

router.post('/usuario', function (req, res) {
    var sql = "INSERT INTO CatUsuario (nombre, apellido, usuario, pass) VALUES ?";
    var values = [
        [req.body.nombre, req.body.apellido, req.body.usuario, req.body.pass]
    ];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        console.log(result.insertId);
        res.json(result);
    });
});

router.delete('/usuario/:id', function (req, res) {
    var id = req.params.id;
    //console.log('Eliminar: ' + id);
    var sql = "DELETE FROM CatUsuario WHERE id = " + id;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
        res.json(result);
    });
});

router.get('/usuario/:id', function (req, res) {
    var id = req.params.id;
    //console.log(id);
    var sql = `select * from CatUsuario where id = ${id}`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result[0]);
    });
});

router.get('/usuario/:usuario/:pass', function (req, res) {
    var usuario = req.params.usuario;
    var pass = req.params.pass;
    var sql = `select id, nombre, apellido, usuario from CatUsuario where usuario = '${usuario}' and pass = '${pass}';`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

router.put('/usuario/:id', function (req, res) {
    var id = req.params.id;
    var sql = `UPDATE CatUsuario SET nombre = '${req.body.nombre}', apellido = '${req.body.apellido}', usuario = '${req.body.usuario}', pass = '${req.body.pass}'
    WHERE id = ${req.body.id}`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records updated: " + result.affectedRows);
        res.json(result);
    });
});


module.exports = router;