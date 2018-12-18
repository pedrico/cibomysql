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
                        sql = "INSERT INTO DetalleOrdenMesa (idMesa, idSesion, idItem, Categoria, Precio, Enviada, fechaInsert, fechaUpdate) VALUES ?";
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
            var sql = ` select * from Sesion
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
                        sql = "INSERT INTO DetalleOrdenMesa (idMesa, idSesion, idItem, Categoria, Precio, Enviada, fechaInsert, fechaUpdate) VALUES ?";
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
                            sql = "INSERT INTO DetalleOrdenMesa (idMesa, idSesion, idItem, Categoria, Precio, Enviada, fechaInsert, fechaUpdate) VALUES ?";
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

    // db.OrdenMesa.findOne({ idmesa: NumeroMesa }, function (err, doc) {
    //     // OrdenMesaResult = JSON.stringify(doc);
    //     OrdenMesaResult = doc;
    //     //console.log("doc");
    //     //console.log(doc);
    //     //console.log("OrdenMesaResult");
    //     //console.log(OrdenMesaResult);
    //     if (OrdenMesaResult == null) {
    //         //console.log("No existe");
    //         //Es la primera vez que se selecciona la mesa, se realiza insert con los datos de la mesa en OrdenMesa
    //         var NuevaOrdenMesa = { idmesa: NumeroMesa, NumeroSesion: 1, cerrada: 0 }
    //         //console.log(NuevaOrdenMesa);
    //         db.OrdenMesa.insert(NuevaOrdenMesa, function (err, ResNuevaOrdenMesa) {
    //             //doc contiene el objeto insertado
    //             //console.log(ResNuevaOrdenMesa);
    //             req.session.OrdenMesaSesion = ResNuevaOrdenMesa.NumeroSesion;

    //             req.session.OrdenMesa = ResNuevaOrdenMesa._id;
    //             //console.log("Numero Sesion Set");
    //             //console.log(req.session.OrdenMesa);
    //             //console.log(req.session);
    //             //console.log(idPlato);
    //             req.session.save();
    //             //Buscar precio de plato 
    //             db.cocina.findOne({ _id: mongojs.ObjectId(idPlato) }, function (errPlato, docPlato) {
    //                 //Agregar el plato a la sesion actual
    //                 var NuevoPlato = { OrdenMesa: ResNuevaOrdenMesa._id, itemCocina: mongojs.ObjectId(idPlato), precio: docPlato.precio, enviada: 0, fechaInsert: Date.now(), fechaUpdate: Date.now() }
    //                 db.DetalleOrdenMesa.insert(NuevoPlato, function (errDetalle, docDetalle) {
    //                     //doc contiene el objeto insertado
    //                     //console.log("Plato agregado");
    //                     //console.log(docDetalle);
    //                     res.json(docPlato);
    //                 });

    //             });
    //             // res.json(ResNuevaOrdenMesa);
    //         });
    //     }
    //     else {
    //         //console.log("Sí existe");
    //         //Si ya existe, se obtiene el NumeroSesion mayor de la mesa seleccionada y se verifica si ya esta cerrada.
    //         //Si ya esta cerrada se crea una nueva sesion y se asigna a la viariable sesion NumeroSesionMesa
    //         //console.log(OrdenMesaResult);
    //         //console.log(doc.idmesa);
    //         db.OrdenMesa.aggregate(
    //             [
    //                 {
    //                     $match: { idmesa: OrdenMesaResult.idmesa }
    //                 },
    //                 {
    //                     $group:
    //                         {
    //                             _id: "$idmesa",
    //                             NumeroSesion: { $max: "$NumeroSesion" }
    //                         }
    //                 }
    //             ], function (errAgregate, docAgregate) {
    //                 if (errAgregate) {
    //                     //console.log(errAgregate.ok);
    //                     //console.log(errAgregate.message);
    //                 }

    //                 //console.log("Max de NumeroSesion");
    //                 //console.log(docAgregate);

    //                 db.OrdenMesa.findOne({ idmesa: NumeroMesa, NumeroSesion: docAgregate[0].NumeroSesion }, function (errMesaCompleto, docMesaCompleto) {
    //                     //console.log("Mesa completo");
    //                     //console.log(NumeroMesa);
    //                     //console.log(docAgregate[0].NumeroSesion);
    //                     //console.log(docMesaCompleto);
    //                     var sesionCerrada = docMesaCompleto.cerrada;
    //                     //console.log(sesionCerrada);
    //                     if (sesionCerrada == 0) {
    //                         req.session.OrdenMesa = docMesaCompleto._id;
    //                         //console.log("Numero Sesion Set");
    //                         //console.log(req.session.OrdenMesa);
    //                         //console.log(req.session);
    //                         //console.log(idPlato);
    //                         req.session.save();
    //                         //Buscar precio de plato 
    //                         db.cocina.findOne({ _id: mongojs.ObjectId(idPlato) }, function (errPlato, docPlato) {
    //                             //Agregar el plato a la sesion actual
    //                             var NuevoPlato = { OrdenMesa: docMesaCompleto._id, itemCocina: mongojs.ObjectId(idPlato), precio: docPlato.precio, enviada: 0, fechaInsert: new Date(), fechaUpdate: new Date() }
    //                             db.DetalleOrdenMesa.insert(NuevoPlato, function (errDetalle, docDetalle) {
    //                                 //doc contiene el objeto insertado
    //                                 //console.log("Plato agregado 2");
    //                                 //console.log(docDetalle);
    //                                 //console.log(docPlato);
    //                                 res.json(docPlato);
    //                             });

    //                         });
    //                     }
    //                     else {
    //                         //Crear una nueva sesion y agregar el plato
    //                         //Es la primera vez que se selecciona la mesa, se realiza insert con los datos de la mesa en OrdenMesa                            
    //                         var NuevaSesion = docMesaCompleto.NumeroSesion;
    //                         NuevaSesion++;
    //                         var NuevaOrdenMesa = { idmesa: NumeroMesa, NumeroSesion: NuevaSesion, cerrada: 0 }
    //                         //console.log(NuevaOrdenMesa);
    //                         db.OrdenMesa.insert(NuevaOrdenMesa, function (err, ResNuevaOrdenMesa) {
    //                             //doc contiene el objeto insertado
    //                             //console.log("Incremento sesion");
    //                             //console.log(ResNuevaOrdenMesa);
    //                             req.session.OrdenMesaSesion = ResNuevaOrdenMesa.NumeroSesion;
    //                             req.session.OrdenMesa = ResNuevaOrdenMesa._id;
    //                             //console.log("Numero Sesion Set");
    //                             //console.log(req.session.OrdenMesa);
    //                             //console.log(req.session);
    //                             //console.log(idPlato);
    //                             req.session.save();
    //                             //Buscar precio de plato 
    //                             db.cocina.findOne({ _id: mongojs.ObjectId(idPlato) }, function (errPlato, docPlato) {
    //                                 //Agregar el plato a la sesion actual
    //                                 var NuevoPlato = { OrdenMesa: ResNuevaOrdenMesa._id, itemCocina: mongojs.ObjectId(idPlato), precio: docPlato.precio, enviada: 0, fechaInsert: new Date(), fechaUpdate: new Date() }
    //                                 db.DetalleOrdenMesa.insert(NuevoPlato, function (errDetalle, docDetalle) {
    //                                     //doc contiene el objeto insertado
    //                                     //console.log("Plato agregado");
    //                                     //console.log(docDetalle);
    //                                     res.json(docPlato);
    //                                 });

    //                             });
    //                             // res.json(ResNuevaOrdenMesa);
    //                         });
    //                     }
    //                 });

    //             })

    //     }
    // });
});

Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}

module.exports = router;