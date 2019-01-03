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
    console.log(Date.now());
    console.log(new Date().addHours(5).toISOString().slice(0, 19).replace('T', ' '));
    next();
});



router.get('/', function (req, res) {
    //if (req.session.usuario != null) {
    var IngredientesExcluidos = [];
    req.session.IngredientesExcluidos = IngredientesExcluidos;
    res.sendFile(path.resolve('../public/SeleccionCocina.html'));
    // } else {
    //     res.sendfile(__dirname + '/public/Login.html');
    // }    
});


router.post('/', function (req, res) {
    var NumeroMesa = req.session.NumeroMesa
    var NumeroSesion = -1;
    var OrdenMesaResult = null;
    var idPlato = req.body.iditemcocina;
    req.session.OrdenMesa = "123";
    req.session.otro = "123";
    console.log("Numero mesa: " + NumeroMesa);
    console.log("Numero mesa: " + idPlato);

    var sql = `select * from Mesa m
                join Sesion s on m.id = s.IdMesa
                where m.id = ${NumeroMesa};`;

    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));

        if (result.length == 0) {
            //Primera vez que se selecciona la mesa
            console.log("nulo");
            sql = "INSERT INTO Mesa (id) VALUES ?";
            var values = [
                [NumeroMesa]
            ];
            con.query(sql, [values], function (err, result) {
                if (err) throw err;
                console.log(JSON.stringify(result));
                console.log("nulo");
                sql = "INSERT INTO Sesion (Num, IdMesa, Cerrada) VALUES ?";
                values = [
                    [1, NumeroMesa, 0]
                ];
                con.query(sql, [values], function (err, result) {
                    if (err) throw err;
                    console.log(JSON.stringify(result));
                    console.log("Id del plato: " + idPlato);
                    sql = `select id, nombre, descripcion, imagen 
                    from CatCocinaPlato c
                    where id = ${idPlato}`;
                    con.query(sql, function (err, result, fields) {
                        if (err) throw err;
                        console.log(JSON.stringify(result));
                        sql = "INSERT INTO DetalleOrdenMesa (idMesa, numSesion, idItem, Categoria, Precio, Enviada, fechaInsert, fechaUpdate) VALUES ?";
                        values = [
                            [NumeroMesa, 1, idPlato, 1, result[0].precio, 0, new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' '), new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' ')]
                        ];
                        con.query(sql, [values], function (err, result) {
                            if (err) throw err;
                            console.log(JSON.stringify(result));
                            res.json(result);
                        });
                    });
                });
            });
        }
        else {
            //Mesa ya ha sido seleccionada mas de 1 vez
            console.log(result.length);
            console.log("Id del plato: " + idPlato);
            sql = ` select * from Sesion
            where idMesa = ${NumeroMesa}
            and num = (select max(num)  as num
                from Sesion 
                where idMesa = ${NumeroMesa});`;
            con.query(sql, function (err, result, fields) {
                if (err) throw err;
                console.log(JSON.stringify(result));
                NumeroSesion = result[0].num;
                var sesionCerrada = result[0].cerrada;
                if (sesionCerrada == 0) {
                    //La cuenta de la mesa sigue abierta, se asigna el plato a la cuenta actual.
                    sql = `select id, nombre, descripcion, imagen 
                    from CatCocinaPlato c
                    where id = ${idPlato}`;
                    con.query(sql, function (err, result, fields) {
                        if (err) throw err;
                        console.log(JSON.stringify(result));
                        sql = "INSERT INTO DetalleOrdenMesa (idMesa, numSesion, idItem, Categoria, Precio, Enviada, fechaInsert, fechaUpdate) VALUES ?";
                        values = [
                            [NumeroMesa, NumeroSesion, idPlato, 1, result[0].precio, 0, new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' '), new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' ')]
                        ];
                        con.query(sql, [values], function (err, result) {
                            if (err) throw err;
                            console.log(JSON.stringify(result));
                            res.json(result);
                        });
                    });
                } else {
                    //La cuenta de la mesa ya cerró, se asigna el plato a una nueva cuenta. Se crea una nueva sesion de la mesa.
                    NumeroSesion = NumeroSesion + 1;
                    sql = "INSERT INTO Sesion (Num, IdMesa, Cerrada) VALUES ?";
                    values = [
                        [NumeroSesion, NumeroMesa, 0]
                    ];
                    con.query(sql, [values], function (err, result) {
                        sql = `select id, nombre, descripcion, imagen 
                        from CatCocinaPlato c
                        where id = ${idPlato}`;
                        con.query(sql, function (err, result, fields) {
                            if (err) throw err;
                            console.log(JSON.stringify(result));
                            sql = "INSERT INTO DetalleOrdenMesa (idMesa, numSesion, idItem, Categoria, Precio, Enviada, fechaInsert, fechaUpdate) VALUES ?";
                            values = [
                                [NumeroMesa, NumeroSesion, idPlato, 1, result[0].precio, 0, new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' '), new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' ')]
                            ];
                            con.query(sql, [values], function (err, result) {
                                if (err) throw err;
                                console.log(JSON.stringify(result));
                                res.json(result);
                            });
                        });
                    });
                }
            });
        }
    });

    
});

router.post('/RedireccionarMesa', function (req, res) {
    res.send({ redireccionar: '/SeleccionMesa' });
});

router.post('/RedireccionarOrden', function (req, res) {
    res.send({ redireccionar: '/ResumenOrden' });
});

router.post('/RedireccionarBebidas', function (req, res) {
    res.send({ redireccionar: '/SeleccionBar' });
});

router.post('/RedireccionarCuentaOrden', function (req, res) {
    res.send({ redireccionar: '/Cuenta' });
});


Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}

module.exports = router;