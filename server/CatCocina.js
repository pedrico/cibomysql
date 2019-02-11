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
        res.sendFile(path.resolve('../public/CatCocina.html'));
    } else {
        res.sendfile(path.resolve('../public/Login.html'));
    }
});

router.get('/cocina', function (req, res) {
    var sql = `select ccp.id, ccp.nombre, ccp.descripcion, ccp.precio, ccp.imagen, ccc.nombre as categoria from CatCocinaPlato ccp
    left join CatCocinaCategoria ccc on ccp.idCocinaCategoria = ccc.id;`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});


router.post('/cocina', function (req, res) {
    console.log(req.body);
    req.body.imagen = nombreArchivo;

    var sql = "INSERT INTO CatCocinaPlato (nombre, descripcion, precio, imagen, categoria, idCocinaCategoria) VALUES ?";
    var values = [
        [req.body.nombre, req.body.descripcion, req.body.precio, req.body.imagen, 1, req.body.idCocinaCategoria]
    ];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

router.post('/cocinaNoImagen', function (req, res) {
    var sql = "INSERT INTO CatCocinaPlato (nombre, descripcion, precio, categoria, idCocinaCategoria) VALUES ?";
    var values = [
        [req.body.nombre, req.body.descripcion, req.body.precio, 1, req.body.idCocinaCategoria]
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
    var sql = "DELETE FROM CatCocinaPlato WHERE id = " + id;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
        res.json(result);
    });
});

router.get('/cocina/:id', function (req, res) {
    var id = req.params.id;
    //console.log(id);
    var sql = `select * from CatCocinaPlato where id = ${id}`;
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
    var sql = `UPDATE CatCocinaPlato SET nombre = '${req.body.nombre}', descripcion = '${req.body.descripcion}', 
    precio = ${req.body.precio}, imagen = '${req.body.imagen}', idCocinaCategoria = ${req.body.idCocinaCategoria}  WHERE id = ${req.body.id}`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records updated: " + result.affectedRows);
        res.json(result);
    });
});

router.put('/cocinaNoImagen/:id', function (req, res) {

    var id = req.params.id;
    var sql = `UPDATE CatCocinaPlato SET nombre = '${req.body.nombre}', descripcion = '${req.body.descripcion}', precio = ${req.body.precio},
     idCocinaCategoria = ${req.body.idCocinaCategoria}   WHERE id = ${req.body.id}`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records updated: " + result.affectedRows);
        res.json(result);
    });
});

//Lista de categorias para drop down list (combobox)
router.get('/ListaCategoriaddl', function (req, res) {
    var sql = ` select * from CatCocinaCategoria `;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

module.exports = router;