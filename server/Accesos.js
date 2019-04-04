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

// router.get('/', function (req, res) {
//     var idUsuario = req.session.idUsuario;
//     console.log("idUsuario: " + idUsuario);
//     if (req.session.usuario != null) {
//         var sql = `select a.id from CatUsuario cu 
//         join Rol r on cu.idRol = r.id
//         join RolAcceso ra on r.id = ra.idRol
//         join Acceso a on ra.idAcceso = a.id
//         where cu.id = ${idUsuario};`;
//         con.query(sql, function (err, result) {
//             if (err) throw err;
//             console.log(JSON.stringify(result));
//             res.json(result);
//         });
//     } else {
//         res.sendfile(path.resolve('../public/Login.html'));
//     }
// });


router.get('/', function (req, res) {
    var idUsuario = req.session.idUsuario;
    console.log("idUsuario: " + idUsuario);
    if (req.session.usuario != null) {
        ObtenerAccesos.ObtenerAccesos(req, con, idUsuario).then(function(response){
            res.json(response);
        })
    } else {
        res.sendfile(path.resolve('../public/Login.html'));
    }
});

module.exports = router;