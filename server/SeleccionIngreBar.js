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
    if (req.session.usuario != null) {
        //Para el áre de seleccion de platos, debe validarse que la mesa haya sido seleccionada
        if (req.session.NumeroMesa != null) {
            res.sendFile(path.resolve('../public/SeleccionIngreBar.html'));
        } else {
            res.sendfile(path.resolve('../public/SeleccionMesa.html'));
        }
    } else {
        res.sendfile(path.resolve('../public/Login.html'));
    }
});

router.get('/:id', function (req, res) {
    var NumeroMesa = req.session.NumeroMesa
    var NumeroSesion = -1;
    var OrdenMesaResult = null;
    var idPlato = req.params.id;
    var sql = "";

    req.session.save();
    console.log("Id del plato: " + idPlato);


    if (req.session.IngredientesExcluidos != null && req.session.IngredientesExcluidos.length > 0) {
        sql = ` select id, nombre, descripcion, imagen 
                from BarBebidaIngre cpl
                join CatBarIngre cci on cpl.idIngre = cci.id
                where idBebida = ${idPlato}
                and idIngre not in (${req.session.IngredientesExcluidos.join(',')})`;
    } else {
        sql = ` select id, nombre, descripcion, imagen 
                from BarBebidaIngre cpl
                join CatBarIngre cci on cpl.idIngre = cci.id
                where idBebida = ${idPlato}`;
    }

    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json(result);
    });

});


router.put('/:id/Ingrediente/:idIngrediente', function (req, res) {

    var id = req.params.id;
    var idIngrediente = req.params.idIngrediente;
    var IngredientesExcluidos = req.session.IngredientesExcluidos;
    console.log("Ingredientes excluidos");
    console.log(req.session.IngredientesExcluidos);
    IngredientesExcluidos.push(idIngrediente);
    req.session.IngredientesExcluidos = IngredientesExcluidos;
    console.log(req.session.IngredientesExcluidos.join(','));
    req.session.save();
    console.log(req.session.IngredientesExcluidos);
    res.json({});

});


router.post('/', function (req, res) {
    var NumeroMesa = req.session.NumeroMesa
    var NumeroSesion = -1;
    var OrdenMesaResult = null;
    var idPlato = req.body.iditemcocina;
    var IngredientesExcluidos = req.session.IngredientesExcluidos;

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
                    from CatBarBebida c
                    where id = ${idPlato}`;
                    con.query(sql, function (err, result, fields) {
                        if (err) throw err;
                        console.log(JSON.stringify(result));
                        sql = "INSERT INTO DetalleOrdenMesa (idMesa, numSesion, idItem, Categoria, Precio, Enviada, fechaInsert, fechaUpdate) VALUES ?";
                        values = [
                            [NumeroMesa, 1, idPlato, 2, result[0].precio, 0, new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' '), new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' ')]
                        ];
                        con.query(sql, [values], function (err, result) {
                            if (err) throw err;
                            console.log("Correlativo");
                            console.log(JSON.stringify(result));



                            console.log("Insertando ingre excluidos");
                            for (var i = 0; i < IngredientesExcluidos.length; i++) {
                                sql = "Insert into IngreRemovido (idDetalleOrdenMesa, idIngre)  VALUES ?";
                                values = [
                                    [result.insertId, IngredientesExcluidos[i]]
                                ];
                                con.query(sql, [values], function (err, result) {
                                    if (err) throw err;
                                    console.log(JSON.stringify(result));
                                });
                            }
                            res.send({ redireccionar: "/SeleccionBar" });
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
                    from CatBarBebida c
                    where id = ${idPlato}`;
                    con.query(sql, function (err, result, fields) {
                        if (err) throw err;
                        console.log(JSON.stringify(result));
                        sql = "INSERT INTO DetalleOrdenMesa (idMesa, numSesion, idItem, Categoria, Precio, Enviada, fechaInsert, fechaUpdate) VALUES ?";
                        values = [
                            [NumeroMesa, NumeroSesion, idPlato, 2, result[0].precio, 0, new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' '), new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' ')]
                        ];
                        con.query(sql, [values], function (err, result) {
                            if (err) throw err;
                            console.log("Correlativo");
                            console.log(JSON.stringify(result));



                            console.log("Insertando ingre excluidos");
                            for (var i = 0; i < IngredientesExcluidos.length; i++) {
                                sql = "Insert into IngreRemovido (idDetalleOrdenMesa, idIngre)  VALUES ?";
                                values = [
                                    [result.insertId, IngredientesExcluidos[i]]
                                ];
                                con.query(sql, [values], function (err, result) {
                                    if (err) throw err;
                                    console.log(JSON.stringify(result));
                                });
                            }
                            res.send({ redireccionar: "/SeleccionBar" });
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
                        from CatBarBebida c
                        where id = ${idPlato}`;
                        con.query(sql, function (err, result, fields) {
                            if (err) throw err;
                            console.log(JSON.stringify(result));
                            sql = "INSERT INTO DetalleOrdenMesa (idMesa, numSesion, idItem, Categoria, Precio, Enviada, fechaInsert, fechaUpdate) VALUES ?";
                            values = [
                                [NumeroMesa, NumeroSesion, idPlato, 2, result[0].precio, 0, new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' '), new Date().addHours(-6).toISOString().slice(0, 19).replace('T', ' ')]
                            ];
                            con.query(sql, [values], function (err, result) {
                                if (err) throw err;
                                console.log("Correlativo");
                                console.log(JSON.stringify(result));



                                console.log("Insertando ingre excluidos");
                                for (var i = 0; i < IngredientesExcluidos.length; i++) {
                                    sql = "Insert into IngreRemovido (idDetalleOrdenMesa, idIngre)  VALUES ?";
                                    values = [
                                        [result.insertId, IngredientesExcluidos[i]]
                                    ];
                                    con.query(sql, [values], function (err, result) {
                                        if (err) throw err;
                                        console.log(JSON.stringify(result));

                                    });

                                }
                                res.send({ redireccionar: "/SeleccionBar" });









                            });
                        });
                    });
                }
            });
        }
    });
});

Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}

module.exports = router;