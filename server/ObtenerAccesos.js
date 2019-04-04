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

exports.ObtenerAccesos = function (req, con, idUsuario) {
    return new Promise(function (resolve, reject) {
        var sql = `select a.id from CatUsuario cu 
            join Rol r on cu.idRol = r.id
            join RolAcceso ra on r.id = ra.idRol
            join Acceso a on ra.idAcceso = a.id
            where cu.id = ${idUsuario};`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result));
            resolve(result);
        });
    });
};

exports.ValidarAccesos = function (req, con, idUsuario, idAcceso) {
    return new Promise(function (resolve, reject) {
        var sql = `select a.id from CatUsuario cu 
            join Rol r on cu.idRol = r.id
            join RolAcceso ra on r.id = ra.idRol
            join Acceso a on ra.idAcceso = a.id
            where cu.id = ${idUsuario}
            and a.id = ${idAcceso};`;

        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result));
            if(result.length > 0){
                resolve(true);
            }else{
                resolve(false);
            }            
        });
    });
};