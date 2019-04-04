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
        ObtenerAccesos.ValidarAccesos(req, con, idUsuario, 6).then(function (response) {
            if (response) {
                res.sendFile(path.resolve('../public/CatBar.html'));
            }
            else {
                res.sendfile(path.resolve('../public/SeleccionMesa.html'));
            }
        });
    } else {
        res.sendfile(path.resolve('../public/Login.html'));
    }
});

router.get('/bar', function (req, res) {
    var sql = `select ccp.id, ccp.nombre, ccp.descripcion, ccp.precio, ccp.imagen, ccc.nombre as categoria from CatBarBebida ccp
    left join CatBarCategoria ccc on ccp.idBarCategoria = ccc.id;`;

    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});


router.post('/bar', function (req, res) {
    console.log(req.body);
    req.body.imagen = nombreArchivo;

    var sql = "INSERT INTO CatBarBebida (nombre, descripcion, precio, imagen, categoria, idBarCategoria) VALUES ?";
    var values = [
        [req.body.nombre, req.body.descripcion, req.body.precio, req.body.imagen, 2, req.body.idBarCategoria]
    ];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

router.post('/barNoImagen', function (req, res) {
    var sql = "INSERT INTO CatBarBebida (nombre, descripcion, precio, categoria, idBarCategoria) VALUES ?";
    var values = [
        [req.body.nombre, req.body.descripcion, req.body.precio, 2, req.body.idBarCategoria]
    ];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

router.delete('/bar/:id', function (req, res) {
    var id = req.params.id;
    //console.log('Eliminar: ' + id);
    var sql = "DELETE FROM CatBarBebida WHERE id = " + id;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
        res.json(result);
    });
});

router.get('/bar/:id', function (req, res) {
    var id = req.params.id;
    //console.log(id);
    var sql = `select * from CatBarBebida where id = ${id}`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result[0]);
    });
});

router.put('/bar/:id', function (req, res) {

    req.body.imagen = nombreArchivo;
    var id = req.params.id;
    //console.log(req.body.nombre);
    var sql = `UPDATE CatBarBebida SET nombre = '${req.body.nombre}', descripcion = '${req.body.descripcion}', 
    precio = ${req.body.precio}, imagen = '${req.body.imagen}', idBarCategoria = ${req.body.idBarCategoria}  WHERE id = ${req.body.id}`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records updated: " + result.affectedRows);
        res.json(result);
    });
});

router.put('/barNoImagen/:id', function (req, res) {

    var id = req.params.id;
    var sql = `UPDATE CatBarBebida SET nombre = '${req.body.nombre}', descripcion = '${req.body.descripcion}', precio = ${req.body.precio},
    idBarCategoria = ${req.body.idBarCategoria}   WHERE id = ${req.body.id}`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records updated: " + result.affectedRows);
        res.json(result);
    });
});

//Lista de categorias para drop down list (combobox)
router.get('/ListaCategoriaddl', function (req, res) {
    var sql = ` select * from CatBarCategoria `;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

module.exports = router;