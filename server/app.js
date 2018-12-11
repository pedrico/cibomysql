const mysql = require('mysql');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123pc",
    database: "restaurante"
});

var app = express();


app.use(express.static(path.resolve('../public')));
app.use(express.static(path.resolve('../uploads')));
app.use(bodyParser.json());
//Configuro localmente los estilos Bootstrap, JQyery https://stackoverflow.com/questions/22792254/how-do-i-load-bootstrap-using-npm
app.use('/js', express.static(path.resolve('../js')));
app.use('/css', express.static(path.resolve('../css')));
app.use('/fonts', express.static(path.resolve('../fonts')));
app.use('/node_modules', express.static(path.resolve('../node_modules')));


con.connect(function (err) {

    if (err) throw err;
    console.log("Connected!");
});

console.log(__dirname);

app.get('/CatCocina', function (req, res) {
    //if (req.session.usuario != null) {
    res.sendFile(path.resolve('../public/CatCocina.html'));
    // } else {
    //     res.sendfile(__dirname + '/public/Login.html');
    // }    
});

app.get('/cocina', function (req, res) {
    var sql = "select * from CatCocinaPlato;";
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

var nombreArchivo = '';
app.post('/cocina', function (req, res) {
    console.log(req.body);
    req.body.imagen = nombreArchivo;

    var sql = "INSERT INTO CatCocinaPlato (nombre, descripcion, precio, imagen) VALUES ?";
    var values = [
        [req.body.nombre, req.body.descripcion, req.body.precio, req.body.imagen]
    ];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

app.post('/cocinaNoImagen', function (req, res) {
    var sql = "INSERT INTO CatCocinaPlato (nombre, descripcion, precio) VALUES ?";
    var values = [
        [req.body.nombre, req.body.descripcion, req.body.precio]
    ];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });
});

app.delete('/cocina/:id', function (req, res) {
    var id = req.params.id;
    //console.log('Eliminar: ' + id);
    var sql = "DELETE FROM CatCocinaPlato WHERE id = " + id;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
        res.json(result);
    });
});

app.get('/cocina/:id', function (req, res) {
    var id = req.params.id;
    //console.log(id);
    var sql = `select * from CatCocinaPlato where id = ${id}`;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result[0]);
    });
});

app.put('/cocina/:id', function (req, res) {

    req.body.imagen = nombreArchivo;
    var id = req.params.id;
    //console.log(req.body.nombre);
    var sql = `UPDATE CatCocinaPlato SET nombre = '${req.body.nombre}', descripcion = '${req.body.descripcion}', 
    precio = ${req.body.precio}, imagen = '${req.body.imagen}'   WHERE id = ${req.body.id}` ;

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records updated: " + result.affectedRows);
        res.json(result);
    });
});

app.put('/cocinaNoImagen/:id', function (req, res) {

    var id = req.params.id;    
    var sql = `UPDATE CatCocinaPlato SET nombre = '${req.body.nombre}', descripcion = '${req.body.descripcion}', precio = ${req.body.precio}   WHERE id = ${req.body.id}` ;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records updated: " + result.affectedRows);
        res.json(result);
    });
});








//Subir Archivo
var multer = require('multer');
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
/** Serving from the same express Server
No cors required */
// app.use(express.static('/public'));
// app.use(bodyParser.json());
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, '../uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        //console.log('multer------');

        nombreArchivo = 'img' + '-' + datetimestamp + '.jpeg';
        // nombreArchivo = 'meme' + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        cb(null, nombreArchivo)
    }
});
var upload = multer({ //multer settings
    storage: storage
}).single('file');
/** API path that will upload the files */
app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log("Error subiendo archivo: " + err);
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        res.json({ error_code: 0, err_desc: null });
    })
});

app.listen(4201);