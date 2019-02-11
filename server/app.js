const mysql = require('mysql');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123pc",
    database: "restaurante",
    timezone: "utc"
});

var app = express();
var nombreArchivo = '';


app.use(express.static(path.resolve('../public')));
app.use(express.static(path.resolve('../uploads')));
app.use(bodyParser.json());
//Documentación de express-session
//https://github.com/expressjs/session#options
//Duracion de la sesion seteada en 1hora = 360000
app.use(session({ secret: 'abcd1234', resave: false, saveUninitialized: false, cookie: { secure: false, maxAge: 360000 } }));
//Configuro localmente los estilos Bootstrap, JQyery https://stackoverflow.com/questions/22792254/how-do-i-load-bootstrap-using-npm
app.use('/js', express.static(path.resolve('../js')));
app.use('/css', express.static(path.resolve('../css')));
app.use('/fonts', express.static(path.resolve('../fonts')));
app.use('/node_modules', express.static(path.resolve('../node_modules')));

//Modulos propios
var CatCocinaCategoria = require('./CatCocinaCategoria');
var CatCocina = require('./CatCocina');
var CatCocinaIngre = require('./CatCocinaIngre');
var CocinaPlatoIngre = require('./CocinaPlatoIngre');
var CatBarCategoria = require('./CatBarCategoria');
var CatBar = require('./CatBar');
var CatBarIngre = require('./CatBarIngre');
var BarBebidaIngre = require('./BarBebidaIngre');
var SeleccionMesa = require('./SeleccionMesa');
var Categoria = require('./Categoria');
var SeleccionCocina = require('./SeleccionCocina');
var SeleccionBar = require('./SeleccionBar');
var ResumenOrden = require('./ResumenOrden');
var SeleccionIngreCocina = require('./SeleccionIngreCocina');
var SeleccionIngreBar = require('./SeleccionIngreBar');
var Cuenta = require('./Cuenta');
var ReporteTotalDia = require('./ReporteTotalDia');
var MesasOcupadas = require('./MesasOcupadas');
var CategoriaCocinaBar = require('./CategoriaCocinaBar');
var CatUsuario = require('./CatUsuario');
var Login = require('./Login');

app.use('/CatCocinaCategoria', CatCocinaCategoria);
app.use('/CatCocina', CatCocina);
app.use('/CatCocinaIngre', CatCocinaIngre);
app.use('/CocinaPlatoIngre', CocinaPlatoIngre);
app.use('/CatBarCategoria', CatBarCategoria);
app.use('/CatBar', CatBar);
app.use('/CatBarIngre', CatBarIngre);
app.use('/BarBebidaIngre', BarBebidaIngre);
app.use('/SeleccionMesa', SeleccionMesa);
app.use('/Categoria', Categoria);
app.use('/SeleccionCocina', SeleccionCocina);
app.use('/SeleccionBar', SeleccionBar);
app.use('/ResumenOrden', ResumenOrden);
app.use('/SeleccionIngreCocina', SeleccionIngreCocina);
app.use('/SeleccionIngreBar', SeleccionIngreBar);
app.use('/Cuenta', Cuenta);
app.use('/ReporteTotalDia', ReporteTotalDia);
app.use('/MesasOcupadas', MesasOcupadas);
app.use('/CategoriaCocinaBar', CategoriaCocinaBar);
app.use('/CatUsuario', CatUsuario);
app.use('/Login', Login);


con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.set('con', con);
app.set('bodyParser', bodyParser);
app.set('path', path);
app.set('session', session);







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