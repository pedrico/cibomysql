var express = require('express');
var ObtenerAccesos = require('./ObtenerAccesos');

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
        //Se validan accesos
        var idUsuario = req.session.idUsuario;
        ObtenerAccesos.ValidarAccesos(req, con, idUsuario, 4).then(function (response) {
            if (response) {
                res.sendFile(path.resolve('../public/CatCocinaIngre.html'));
            }
            else {
                res.sendfile(path.resolve('../public/SeleccionMesa.html'));
            }
        });
    } else {
        res.sendfile(path.resolve('../public/Login.html'));
    }
});

router.get('/ingrediente', function (req, res) {
    var sql = "select * from CatCocinaIngre;";
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

router.post('/ingrediente', function (req, res) {

    req.body.imagen = nombreArchivo;
    console.log(req.body);

    if (req.body.descripcion == null) {
        req.body.descripcion = "";
    }

    var sql = "INSERT INTO CatCocinaIngre (nombre, descripcion, imagen) VALUES ?";
    var values = [
        [req.body.nombre, req.body.descripcion, req.body.imagen]
    ];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

router.post('/ingredienteNoImagen', function (req, res) {
    var sql = "INSERT INTO CatCocinaIngre (nombre, descripcion) VALUES ?";
    var values = [
        [req.body.nombre, req.body.descripcion]
    ];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

router.delete('/ingrediente/:id', function (req, res) {
    var id = req.params.id;

    var sql = "DELETE FROM CatCocinaIngre WHERE id = " + id;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
        res.json(result);
    });
});

router.get('/ingrediente/:id', function (req, res) {
    var id = req.params.id;
    //console.log(id);
    var sql = `select * from CatCocinaIngre where id = ${id}`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result[0]);
    });
});

router.put('/ingrediente/:id', function (req, res) {

    req.body.imagen = nombreArchivo;
    var id = req.params.id;
    //console.log(req.body.nombre);
    var sql = `UPDATE CatCocinaIngre SET nombre = '${req.body.nombre}', descripcion = '${req.body.descripcion}', 
    imagen = '${req.body.imagen}'   WHERE id = ${req.body.id}`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records updated: " + result.affectedRows);
        res.json(result);
    });
});

router.put('/ingredienteNoImagen/:id', function (req, res) {

    var id = req.params.id;
    var sql = `UPDATE CatCocinaIngre SET nombre = '${req.body.nombre}', descripcion = '${req.body.descripcion}'  WHERE id = ${req.body.id}`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records updated: " + result.affectedRows);
        res.json(result);
    });
});


module.exports = router;