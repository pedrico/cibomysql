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
    res.sendFile(path.resolve('../public/CatBarCategoria.html'));
    } else {
        res.sendfile(path.resolve('../public/Login.html'));
    }    
});

router.get('/cocina', function (req, res) {
    var sql = "select * from CatBarCategoria;";
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});


router.post('/cocina', function (req, res) {
    console.log(req.body);
    req.body.imagen = nombreArchivo;

    var sql = "INSERT INTO CatBarCategoria (nombre, imagen) VALUES ?";
    var values = [
        [req.body.nombre, req.body.imagen]
    ];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

router.post('/cocinaNoImagen', function (req, res) {
    var sql = "INSERT INTO CatBarCategoria (nombre) VALUES ?";
    var values = [
        [req.body.nombre]
    ];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        console.log(result.insertId);
        res.json(result);
    });
});

router.delete('/cocina/:id', function (req, res) {
    var id = req.params.id;
    //console.log('Eliminar: ' + id);
    var sql = "DELETE FROM CatBarCategoria WHERE id = " + id;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
        res.json(result);
    });
});

router.get('/cocina/:id', function (req, res) {
    var id = req.params.id;
    //console.log(id);
    var sql = `select * from CatBarCategoria where id = ${id}`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result[0]);
    });
});

router.put('/cocina/:id', function (req, res) {

    req.body.imagen = nombreArchivo;
    var id = req.params.id;
    //console.log(req.body.nombre);
    var sql = `UPDATE CatBarCategoria SET nombre = '${req.body.nombre}', imagen = '${req.body.imagen}' WHERE id = ${req.body.id}`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records updated: " + result.affectedRows);
        res.json(result);
    });
});

router.put('/cocinaNoImagen/:id', function (req, res) {

    var id = req.params.id;
    var sql = `UPDATE CatBarCategoria SET nombre = '${req.body.nombre}' WHERE id = ${req.body.id}`;
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records updated: " + result.affectedRows);
        res.json(result);
    });
});


module.exports = router;