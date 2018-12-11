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
var nombreArchivo = '';


app.use(express.static(path.resolve('../public')));
app.use(express.static(path.resolve('../uploads')));
app.use(bodyParser.json());
//Configuro localmente los estilos Bootstrap, JQyery https://stackoverflow.com/questions/22792254/how-do-i-load-bootstrap-using-npm
app.use('/js', express.static(path.resolve('../js')));
app.use('/css', express.static(path.resolve('../css')));
app.use('/fonts', express.static(path.resolve('../fonts')));
app.use('/node_modules', express.static(path.resolve('../node_modules')));

//Modulos propios
var CatCocina = require('./CatCocina');


app.use('/CatCocina', CatCocina);


con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.set('con', con);
app.set('bodyParser', bodyParser);
app.set('path', path);












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
        app.set('nombreArchivo', nombreArchivo);
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