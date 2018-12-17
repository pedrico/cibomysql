var express = require('express');

var router = express.Router();
var con;
var path;
var nombreArchivo;

router.use(function variablesGlobales(req,res,next){
    console.log("obteniendo conexion");
    con  = req.app.get('con');
    path  = req.app.get('path');
    nombreArchivo = req.app.get('nombreArchivo');;
    console.log("conexion obtenida");
    next();
});

router.get('/', function (req, res) {
    //if (req.session.usuario != null) {
    res.sendFile(path.resolve('../public/CocinaPlatoIngre.html'));
    // } else {
    //     res.sendfile(__dirname + '/public/Login.html');
    // }    
});

//Lista de ingredientes para grid
router.get('/ListaGrid/:id', function (req, res) {
    var id = req.params.id;
    console.log("Id del plato: "+id);
    var sql = ` select id, nombre, descripcion, imagen 
                from CocinaPlatoIngre cpl
                join CatCocinaIngre cci on cpl.idIngre = cci.id
                where idPlato = ${id}`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

//Lista de ingredientes para drop down list (combobox)
router.get('/Listaddl', function (req, res) {        
    var sql = ` select * from CatCocinaIngre `;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

router.post('/:id', function (req, res) {
    var idPlato = req.params.id;  
    var idIngre = req.body.id;  
    console.log(req.body);
    var sql = "INSERT INTO CocinaPlatoIngre (idPlato, idIngre) VALUES ?";
    var values = [
        [idPlato, idIngre]
    ];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

router.delete('/:id/Ingrediente/:idIngrediente', function (req, res) {
    var idPlato = req.params.id;
    var idIngre = req.params.idIngrediente;

    var sql = `DELETE FROM CocinaPlatoIngre WHERE idPlato = ${idPlato} and idIngre = ${idIngre}`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
        res.json(result);
    });
});
module.exports = router;