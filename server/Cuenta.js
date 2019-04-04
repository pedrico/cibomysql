var express = require('express');
var ObtenerAccesos = require('./ObtenerAccesos');
var Impresion = require('./Impresion');

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
            ObtenerAccesos.ValidarAccesos(req, con, idUsuario, 16).then(function (response) {
                if (response) {
                    res.sendFile(path.resolve('../public/Cuenta.html'));
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
        if (result.length > 0) { //Si la mesa nunca ha sido seleccionada, la sesion no existe y el arreglo devuelto es vacío.
            NumeroSesion = result[0].num;

            sql = ` select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion, dom.precio, dom.cantidad, dom.cantidadPagada, dom.cantidadEliminada,
            dom.precio * (dom.cantidad - dom.cantidadEliminada - dom.cantidadPagada) as subtotal, ccc.nombre as categoria
            from 
            Mesa m
            join Sesion s on m.id = s.IdMesa
            join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
            join CatCocinaPlato ccp on dom.IdItem = ccp.Id and dom.Categoria = 1        
            left join CatCocinaCategoria ccc on ccc.id = ccp.idCocinaCategoria
            where m.id = ${NumeroMesa}
            and s.num = ${NumeroSesion}
            and s.Cerrada = 0
            and (dom.Enviada = 2 or dom.Enviada = 4)
            group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion, dom.cantidad;
            `;

            if (result.length == 0) {
                res.json({});
            }
            else {
                console.log(sql);
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    console.log(JSON.stringify(result));
                    res.json(result);
                });
            }
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
        if (result.length > 0) { //Si la mesa nunca ha sido seleccionada, la sesion no existe y el arreglo devuelto es vacío.
            NumeroSesion = result[0].num;

            sql = ` select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion, dom.precio, dom.cantidad, dom.cantidadPagada, dom.cantidadEliminada,
            dom.precio * (dom.cantidad -dom.cantidadEliminada - dom.cantidadPagada) as subtotal, cbc.nombre as categoria
            from 
            Mesa m
            join Sesion s on m.id = s.IdMesa
            join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
            join CatBarBebida ccp on dom.IdItem = ccp.Id and dom.Categoria = 2       
            left join CatBarCategoria cbc on cbc.id = ccp.idBarCategoria
            where m.id = ${NumeroMesa}
            and s.num = ${NumeroSesion}
            and s.Cerrada = 0
            and (dom.Enviada = 2 or dom.Enviada = 4)
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

        sql = `
            UPDATE DetalleOrdenMesa SET cantidadPagada = cantidad - cantidadEliminada, Enviada = 4, fechaUpdate = '${new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' ')}' 
            WHERE idMesa = ${NumeroMesa} 
            and numSesion = ${NumeroSesion}
            and (Enviada = 2 or Enviada = 4)`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Number of records updated: " + result.affectedRows);
            Impresion.ticketDetallePagado(req, con).then(function (response) {
                return Impresion.imprimir2(response, "-");
            }).then(function (response) {
                sql = `UPDATE Sesion SET Cerrada = 1 WHERE idMesa = ${NumeroMesa} and num = ${NumeroSesion}`;
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("Number of records updated: " + result.affectedRows);
                    res.send({ redireccionar: "/SeleccionMesa" });
                });
            });
        });
    });
});

router.put('/Cerrar', function (req, res) {
    //Se validan accesos
    var idUsuario = req.session.idUsuario;
    ObtenerAccesos.ValidarAccesos(req, con, idUsuario, 18).then(function (response) {
        if (response) {
            //Se verifica si hay una session OrdenMesa abierta    
            var NumeroMesa = req.session.NumeroMesa;
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

                sql = `
            UPDATE DetalleOrdenMesa SET cantidadEliminada = cantidad - cantidadPagada, Enviada = 4, fechaUpdate = '${new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' ')}' 
            WHERE idMesa = ${NumeroMesa} 
            and numSesion = ${NumeroSesion}
            and (Enviada = 2 or Enviada = 4)`;
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("Number of records updated: " + result.affectedRows);
                    Impresion.ticketDetallePagado(req, con).then(function (response) {
                        return Impresion.imprimir2(response, "!");
                    }).then(function (response) {
                        sql = `UPDATE Sesion SET Cerrada = 1 WHERE idMesa = ${NumeroMesa} and num = ${NumeroSesion}`;
                        con.query(sql, function (err, result) {
                            if (err) throw err;
                            console.log("Number of records updated: " + result.affectedRows);
                            res.send({ redireccionar: "/SeleccionMesa" });
                        });
                    });
                });
            });
        }
        else {
            res.send({ sinacceso: "Sin acceso para realizar esta operación!" });
        }
    });


});

router.put('/EliminarItem', function (req, res) {
    //Se validan accesos
    var idUsuario = req.session.idUsuario;
    ObtenerAccesos.ValidarAccesos(req, con, idUsuario, 18).then(function (response) {
        if (response) {
            var idDetalleOrdenMesa = req.body.idDetalleOrdenMesa;
            var cantidadEliminada = req.body.cantidadEliminada;

            var sql = `UPDATE DetalleOrdenMesa      
            SET cantidadEliminada = cantidadEliminada + ${cantidadEliminada}, Enviada = 4, fechaUpdate = '${new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' ')}' WHERE id = ${idDetalleOrdenMesa}`;
            console.log(sql);
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Number of records updated: " + result.affectedRows);
                res.json(result);
            });
        }
        else {
            res.send({ sinacceso: "Sin acceso para realizar esta operación!" });
        }
    });
});

router.put('/PagarItem', function (req, res) {
    var idDetalleOrdenMesa = req.body.idDetalleOrdenMesa;
    var cantidadPagada = req.body.cantidadPagada;

    var sql = `UPDATE DetalleOrdenMesa    
    SET cantidadPagada = cantidadPagada + ${cantidadPagada}, Enviada = 4, fechaUpdate = '${new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' ')}' WHERE id = ${idDetalleOrdenMesa}`;
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records updated: " + result.affectedRows);
        res.json(result);
    });

});

router.post('/ticket', function (req, res) {
    var sql = "select 'Cibo'";

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        //imprimir();
        Impresion.ticketDetalle(req, con).then(function (response) {
            return Impresion.imprimir2(response, ":");
        }).then(function (response) {
            res.send({ redireccionar: "/SeleccionMesa" });
        });
    });
});

module.exports = router;
