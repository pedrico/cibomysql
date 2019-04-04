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
        //Para el áre de seleccion de platos, debe validarse que la mesa haya sido seleccionada
        if (req.session.NumeroMesa != null && req.session.NumeroMesa != "") {
            //Se validan accesos
            var idUsuario = req.session.idUsuario;
            ObtenerAccesos.ValidarAccesos(req, con, idUsuario, 14).then(function (response) {
                if (response) {
                    res.sendFile(path.resolve('../public/ResumenOrden.html'));
                }
                else {
                    res.sendfile(path.resolve('../public/SeleccionMesa.html'));
                }
            });
        } else {
            res.sendfile(path.resolve('../public/SeleccionMesa.html'));
        }
    } else {
        res.sendfile(path.resolve('../public/Login.html'));
    }
});

router.get('/ResumenOrdenDetalle', function (req, res) {
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
        if (result.length > 0) { //Si la mesa nunca ha sido seleccionada, la sesion no existe y el arreglo devuelto es vacío.
            NumeroSesion = result[0].num;

            sql = ` select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion, dom.cantidad, GROUP_CONCAT(cci.nombre SEPARATOR ' - ') as ingre, ccc.nombre as categoria
            from 
            Mesa m
            join Sesion s on m.id = s.IdMesa
            join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
            join CatCocinaPlato ccp on dom.IdItem = ccp.Id and dom.Categoria = 1
            left join IngreRemovido ir on dom.Id = ir.idDetalleOrdenMesa
            left join CatCocinaIngre cci on ir.idIngre = cci.id
            left join CatCocinaCategoria ccc on ccc.id = ccp.idCocinaCategoria
            where m.id = ${NumeroMesa}
            and s.num = ${NumeroSesion}
            and s.Cerrada = 0
            and dom.Enviada = 0
            group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion, dom.cantidad;
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

        }
    });
});

router.get('/ResumenOrdenDetalleBar', function (req, res) {
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
        if (result.length > 0) { //Si la mesa nunca ha sido seleccionada, la sesion no existe y el arreglo devuelto es vacío.
            NumeroSesion = result[0].num;

            sql = ` select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion, dom.cantidad, GROUP_CONCAT(cci.nombre SEPARATOR ' - ') as ingre, cbc.nombre as categoria 
            from 
            Mesa m
            join Sesion s on m.id = s.IdMesa
            left join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
            join CatBarBebida ccp on dom.IdItem = ccp.Id and dom.Categoria = 2
            left join IngreRemovido ir on dom.Id = ir.idDetalleOrdenMesa
            left join CatBarIngre cci on ir.idIngre = cci.id
            left join CatBarCategoria cbc on cbc.id = ccp.idBarCategoria
            where m.id = ${NumeroMesa}
            and s.num = ${NumeroSesion}
            and s.Cerrada = 0
            and dom.Enviada = 0
            group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion, dom.cantidad;
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
        }
    });
});

router.put('/ResumenOrdenDetalle', function (req, res) {
    console.log("ResumenOrdenDetalle put")
    console.log(req.body);

    var data = req.body;
    //console.log("Data");
    //console.log(data);
    //Se arma un array con los id de DetalleOrdenMesa para actualizar campo enviada = 1
    var idDetallesEnviar = [];
    for (var i in data) {
        //console.log("id" + data[i].itemCocina)
        idDetallesEnviar.push(data[i].idDetalleOrdenMesa)
    }

    if (idDetallesEnviar.length > 0) {
        // idDetallesEnviar = [ idDetallesEnviar.slice(0, -1) ]; //Se elimina el último caracter
        console.log(idDetallesEnviar);

        var sql = `UPDATE DetalleOrdenMesa SET enviada = 1, fechaUpdate = '${new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' ')}' WHERE id in (${idDetallesEnviar.join(',')});`;

        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Number of records updated: " + result.affectedRows);
            res.json(result);
        });

    } else {
        res.send({});

    }


});


router.put('/ResumenOrdenDetalleCancelar', function (req, res) {
    console.log("ResumenOrdenDetalle put")
    console.log(req.body);

    var data = req.body;
    //console.log("Data");
    //console.log(data);
    //Se arma un array con los id de DetalleOrdenMesa para actualizar campo enviada = 1
    var idDetallesEnviar = [];
    for (var i in data) {
        //console.log("id" + data[i].itemCocina)
        idDetallesEnviar.push(data[i].idDetalleOrdenMesa)
    }

    // idDetallesEnviar = [ idDetallesEnviar.slice(0, -1) ]; //Se elimina el último caracter
    console.log(idDetallesEnviar);

    var sql = `UPDATE DetalleOrdenMesa SET enviada = 3, fechaUpdate = '${new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' ')}' WHERE id in (${idDetallesEnviar.join(',')});`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records updated: " + result.affectedRows);
        res.send({ redireccionar: "/SeleccionMesa" });
    });

});

router.post('/ResumenOrdenDetalleAgregar', function (req, res) {
    //console.log('Redireccionar');
    res.send({ redireccionar: "/Categoria" });
});

router.put('/ResumenOrdenDetalleEliminar/:id', function (req, res) {
    var id = req.params.id;
    //console.log(id);
    db.DetalleOrdenMesa.remove({ _id: mongojs.ObjectId(id) }, function (err, doc) {
        res.json(doc);
    });
});

router.delete('/ResumenOrdenDetalleEliminar/:id', function (req, res) {
    var id = req.params.id;
    var sql = "DELETE FROM DetalleOrdenMesa WHERE id = " + id;
    con.query(sql, function (err, result) {
        if (err) throw err;
        sql = "DELETE FROM IngreRemovido WHERE idDetalleOrdenMesa = " + id;
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.json(result);
        });

    });

});




module.exports = router;