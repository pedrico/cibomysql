var express = require('express');

const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;




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

async function imprimir() {
    try {

        let printer = new ThermalPrinter({
            type: PrinterTypes.EPSON,
            interface: '/dev/usb/lp1'
        });

        printer.alignCenter();

        printer.println("Habitat Cafe & Restaurante");
        await printer.printImage('../public/Imagenes/logo.png')
        printer.cut();
        let execute = printer.execute()
        console.error("Print done!");
    } catch (error) {
        console.log("Print failed:", error);
    }
}


let printer;
exports.imprimir2 = async function (detalleCocina, diferenciador) {
    // return new Promise(function (resolve, reject) {
    try {
        printer = new ThermalPrinter({
            type: PrinterTypes.EPSON,
            interface: '/dev/usb/lp1',
            characterSet: 'Spain I'

        });

        printer.alignCenter();

        printer.println("Habitat Cafe & Restaurante");
        printer.println(diferenciador + new Date().toString().slice(0, 24));
        await printer.printImage('../public/Imagenes/logo.png')
        printer.println();
        printer.alignLeft();
        let objTotal = { totalpagar: 0, totalpagado:0 , totalpendiente: 0 };
        detalleCocina.forEach(imprimirLinea.bind(undefined, objTotal));
        console.log("Total a pagar " + "Q." + objTotal.totalpagar.toFixed(2));
        console.log("Total a pagado " + "Q." + objTotal.totalpagado.toFixed(2));
        console.log("Total a pendiente " + "Q." + objTotal.totalpendiente.toFixed(2));
        printer.println();
        printer.println("Total a pagar " + "Q." + objTotal.totalpagar.toFixed(2));
        printer.println("Total a pagado " + "Q." + objTotal.totalpagado.toFixed(2));
        printer.println("Total a pendiente " + "Q." + objTotal.totalpendiente.toFixed(2));
        printer.println();
        printer.alignCenter();
        printer.println("Te esperamos pronto!");
        printer.cut();
        let execute = printer.execute()
        console.error("Print done!");
    } catch (error) {
        console.log("Print failed:", error);
    }
    // resolve();
    // });
};

function imprimirLinea(objTotal, detalle) {
    console.log("Item");
    //console.log(detalle.cantidadPagada + " " + detalle.categoria + " " + detalle.nombre + " ---- " + detalle.precio + detalle.subtotal + "p/u");        
    printer.alignLeft();
    printer.println(detalle.cantidad + " " + detalle.categoria + " " + detalle.nombre + " -- " + "Q." + detalle.precio.toFixed(2) + "/u");
    printer.alignRight();
    printer.println("Q." + detalle.pendiente.toFixed(2));
    objTotal.totalpagar += detalle.pagar;
    objTotal.totalpagado += detalle.pagado;
    objTotal.totalpendiente += detalle.pendiente;

}

exports.ticketDetalle = function (req, con) {
    return new Promise(function (resolve, reject) {
        this.con = con;
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

                sql = `
                    (select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion, dom.precio, (dom.cantidad - dom.cantidadEliminada) as cantidad, dom.cantidadPagada, dom.cantidadEliminada,
                    dom.precio * (dom.cantidad - dom.cantidadEliminada) as pagar, 
                    dom.precio * (dom.cantidad - dom.cantidadEliminada - dom.cantidadPagada) as pendiente, 
                    dom.precio * (dom.cantidadPagada) as pagado, 
                    ccc.nombre as categoria
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
                    group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion, dom.cantidad)
                    union
                    (select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion, dom.precio, (dom.cantidad - dom.cantidadEliminada) as cantidad, dom.cantidadPagada, dom.cantidadEliminada,
                    dom.precio * (dom.cantidad - dom.cantidadEliminada) as pagar, 
                    dom.precio * (dom.cantidad - dom.cantidadEliminada - dom.cantidadPagada) as pendiente, 
                    dom.precio * (dom.cantidadPagada) as pagado, 
                    cbc.nombre as categoria
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
                    group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion, dom.cantidad)

            `;

                if (result.length == 0) {
                    console.log('Sin resultados');
                    resolve(JSON.stringify({}));
                    //res.json({});
                }
                else {
                    console.log(sql);
                    con.query(sql, function (err, result, fields) {
                        if (err) throw err;
                        //console.log(result);
                        //console.log('----------------');
                        //console.log(JSON.stringify(result));
                        resolve(result);
                    });
                }
            }
            else {
                resolve(JSON.stringify({}));
            }

        });
    });
}


exports.ticketDetallePagado = function (req, con) {
    return new Promise(function (resolve, reject) {
        this.con = con;
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

                sql = `
                    (select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion, dom.precio, (dom.cantidad - dom.cantidadEliminada) as cantidad,  dom.cantidadPagada, dom.cantidadEliminada,
                    dom.precio * (dom.cantidad - dom.cantidadEliminada) as pagar, 
                    dom.precio * (dom.cantidad - dom.cantidadEliminada - dom.cantidadPagada) as pendiente, 
                    dom.precio * (dom.cantidadPagada) as pagado, 
                    ccc.nombre as categoria
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
                    group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion, dom.cantidad)
                    union
                    (select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion, dom.precio, (dom.cantidad - dom.cantidadEliminada) as cantidad,  dom.cantidadPagada, dom.cantidadEliminada,
                    dom.precio * (dom.cantidad - dom.cantidadEliminada) as pagar, 
                    dom.precio * (dom.cantidad - dom.cantidadEliminada - dom.cantidadPagada) as pendiente, 
                    dom.precio * (dom.cantidadPagada) as pagado, 
                    cbc.nombre as categoria
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
                    group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion, dom.cantidad)

            `;

                if (result.length == 0) {
                    console.log('Sin resultados');
                    resolve(JSON.stringify({}));
                    //res.json({});
                }
                else {
                    console.log(sql);
                    con.query(sql, function (err, result, fields) {
                        if (err) throw err;
                        //console.log(result);
                        //console.log('----------------');
                        //console.log(JSON.stringify(result));
                        resolve(result);
                    });
                }
            }
            else {
                resolve(JSON.stringify({}));
            }

        });
    });
}

// module.exports = router;
