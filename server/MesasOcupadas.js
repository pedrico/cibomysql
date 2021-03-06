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
        ObtenerAccesos.ValidarAccesos(req, con, idUsuario, 22).then(function (response) {
            if (response) {
                res.sendFile(path.resolve('../public/MesasOcupadas.html'));
            }
            else {
                res.sendfile(path.resolve('../public/SeleccionMesa.html'));
            }
        });
    } else {
        res.sendfile(path.resolve('../public/Login.html'));
    }
});

router.get('/Listado', function (req, res) {
    //Seleccion de saldo de mesas abiertas (aún no canceladas)
    var sql = `select m.id, sum(dom.precio * (dom.cantidad - dom.cantidadEliminada - dom.cantidadPagada)) as total
    from 
    Mesa m
    join Sesion s on m.id = s.IdMesa
    join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
    
    where    
    s.Cerrada = 0
    and (dom.Enviada = 2 or dom.Enviada = 4)
    group by m.id;
    `;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});


router.post('/RedireccionarCuentaOrden', function (req, res) {
    console.log(req.body.NumeroMesa);
    req.session.NumeroMesa = req.body.NumeroMesa;
    res.send({ redireccionar: '/Cuenta' });
});

router.put('/Cerrar', function (req, res) {

    //Se verifica si hay una session OrdenMesa abierta    
    var NumeroMesa = req.body.NumeroMesa;
    var OrdenMesaResult = null;

    var sql = ` select * from Sesion
            where idMesa = ${NumeroMesa}
            and num = (select max(num)  as num
                from Sesion 
                where idMesa = ${NumeroMesa});`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        NumeroSesion = result[0].num;

        sql = `UPDATE DetalleOrdenMesa SET cantidadEliminada = cantidad - cantidadPagada, Enviada = 4, fechaUpdate = '${new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' ')}' WHERE idMesa = ${NumeroMesa} and numSesion = ${NumeroSesion}`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Number of records updated: " + result.affectedRows);
            sql = `UPDATE Sesion SET Cerrada = 1 WHERE idMesa = ${NumeroMesa} and num = ${NumeroSesion}`;
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Number of records updated: " + result.affectedRows);
                res.send({ redireccionar: "/SeleccionMesa" });
            });
        });
    });
});


router.put('/Pagar', function (req, res) {

    //Se verifica si hay una session OrdenMesa abierta    
    var NumeroMesa = req.body.NumeroMesa;
    var NumeroSesion = -1;
    var OrdenMesaResult = null;

    var sql = ` select * from Sesion
            where idMesa = ${NumeroMesa}
            and num = (select max(num)  as num
                from Sesion 
                where idMesa = ${NumeroMesa});`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        NumeroSesion = result[0].num;

        sql = `UPDATE DetalleOrdenMesa SET cantidadPagada = cantidad - cantidadEliminada, Enviada = 4, fechaUpdate = '${new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' ')}' WHERE idMesa = ${NumeroMesa} and numSesion = ${NumeroSesion}`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Number of records updated: " + result.affectedRows);
            sql = `UPDATE Sesion SET Cerrada = 1 WHERE idMesa = ${NumeroMesa} and num = ${NumeroSesion}`;
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Number of records updated: " + result.affectedRows);
                res.send({ redireccionar: "/SeleccionMesa" });
            });
        });
    });
});





module.exports = router;