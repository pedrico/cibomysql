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
        res.sendFile(path.resolve('../public/ReporteTotalDia.html'));
    } else {
        res.sendfile(path.resolve('../public/Login.html'));
    }
});

router.post('/ReporteTotalDiaDetalleCocina', function (req, res) {
    console.log("Parametros fechasas");
    console.log(req.body);
    var jFechaIni = req.body.fechaini;
    var jFechaFin = req.body.fechafin;
    // var fechaini = new Date(req.body.fechaini);
    // var fechafin = new Date(req.body.fechafin);
    // var fechaini = new Date(jFechaIni.anio, jFechaIni.mes, jFechaIni.dia, jFechaIni.hora, jFechaIni.minuto, 0, 0);
    // var fechafin = new Date(jFechaFin.anio, jFechaFin.mes, jFechaFin.dia, jFechaFin.hora, jFechaFin.minuto, 0, 0);
    var fechaini = fechaMySQL(jFechaIni);
    var fechafin = fechaMySQL(jFechaFin);

    console.log("Fecha ini" + fechaini);
    console.log("Fecha fin" + fechafin);



    sql = ` select dom.id as idDetalleOrdenMesa, dom.fechaUpdate, ccp.id, ccp.nombre, ccp.descripcion , dom.precio, dom.cantidadPagada as cantidad, dom.precio * dom.cantidadPagada as subtotal, ccc.nombre as categoria
            from 
            Mesa m
            join Sesion s on m.id = s.IdMesa
            join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
            join CatCocinaPlato ccp on dom.IdItem = ccp.Id and dom.Categoria = 1 
            left join CatCocinaCategoria ccc on ccc.id = ccp.idCocinaCategoria
            where dom.Enviada = 4
            and dom.fechaUpdate >= '${fechaini}' 
            and dom.fechaUpdate <= '${fechafin}'
            order by dom.fechaUpdate;
                `;
    console.log(sql);
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });


});

var fechaMySQL = function (fechaJson) {
    var resultado = fechaJson.anio + "-" + (fechaJson.mes + 1) + "-" + fechaJson.dia + " " + fechaJson.hora + ":" + fechaJson.minuto + ":00";
    return resultado;
}

router.post('/ReporteTotalDiaDetalleBar', function (req, res) {
    console.log("Parametros fechasas");
    console.log(req.body);
    var jFechaIni = req.body.fechaini;
    var jFechaFin = req.body.fechafin;
    // var fechaini = new Date(req.body.fechaini);
    // var fechafin = new Date(req.body.fechafin);
    // var fechaini = new Date(jFechaIni.anio, jFechaIni.mes, jFechaIni.dia, jFechaIni.hora, jFechaIni.minuto, 0, 0);
    // var fechafin = new Date(jFechaFin.anio, jFechaFin.mes, jFechaFin.dia, jFechaFin.hora, jFechaFin.minuto, 0, 0);
    var fechaini = fechaMySQL(jFechaIni);
    var fechafin = fechaMySQL(jFechaFin);

    console.log("Fecha ini" + fechaini);
    console.log("Fecha fin" + fechafin);



    sql = ` select dom.id as idDetalleOrdenMesa, dom.fechaUpdate, ccp.id, ccp.nombre, ccp.descripcion , dom.precio, dom.cantidadPagada as cantidad, dom.precio * dom.cantidadPagada as subtotal, cbc.nombre as categoria
            from 
            Mesa m
            join Sesion s on m.id = s.IdMesa
            join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
            join CatBarBebida ccp on dom.IdItem = ccp.Id and dom.Categoria = 2
            left join CatBarCategoria cbc on cbc.id = ccp.idBarCategoria
            where dom.Enviada = 4
            and dom.fechaUpdate >= '${fechaini}' 
            and dom.fechaUpdate <= '${fechafin}'
            order by dom.fechaUpdate;
                `;
    console.log(sql);
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });


});

var fechaMySQL = function (fechaJson) {
    var resultado = fechaJson.anio + "-" + (fechaJson.mes + 1) + "-" + fechaJson.dia + " " + fechaJson.hora + ":" + fechaJson.minuto + ":00";
    return resultado;
}


module.exports = router;