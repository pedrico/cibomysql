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
    res.sendFile(path.resolve('../public/Cuenta.html'));
    // } else {
    //     res.sendfile(__dirname + '/public/Login.html');
    // }    
});

router.get('/CuentaDetalleCocina', function (req, res) {
    //Se verifica si hay una session OrdenMesa abierta
    var NumeroMesa = req.session.NumeroMesa;
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

        sql = ` select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion , ccp.precio as subtotal from 
        Mesa m
        join Sesion s on m.id = s.IdMesa
        join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
        join CatCocinaPlato ccp on dom.IdItem = ccp.Id and dom.Categoria = 1        
        where m.id = ${NumeroMesa}
        and s.num = ${NumeroSesion}
        and s.Cerrada = 0
        and dom.Enviada = 2
        group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion;
        `;

        if (result.length == 0) {
            res.json({});
        }
        else {
            con.query(sql, function (err, result, fields) {
                if (err) throw err;
                console.log(JSON.stringify(result));
                res.json(result);
            });
        }
    });
});


router.get('/CuentaDetalleBar', function (req, res) {
    //Se verifica si hay una session OrdenMesa abierta
    var NumeroMesa = req.session.NumeroMesa;
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

        sql = ` select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion , ccp.precio as subtotal from 
        Mesa m
        join Sesion s on m.id = s.IdMesa
        join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
        join CatBarBebida ccp on dom.IdItem = ccp.Id and dom.Categoria = 2       
        where m.id = ${NumeroMesa}
        and s.num = ${NumeroSesion}
        and s.Cerrada = 0
        and dom.Enviada = 2
        group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion;
        `;

        if (result.length == 0) {
            res.json({});
        }
        else {
            con.query(sql, function (err, result, fields) {
                if (err) throw err;
                console.log(JSON.stringify(result));
                res.json(result);
            });
        }
    });
});

router.put('/CuentaPagarOrden', function (req, res) {

    //Se verifica si hay una session OrdenMesa abierta
    var NumeroMesa = req.session.NumeroMesa;
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

        sql = `UPDATE DetalleOrdenMesa SET Enviada = 4, fechaUpdate = '${new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' ')}' WHERE idMesa = ${NumeroMesa} and numSesion = ${NumeroSesion}`;
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