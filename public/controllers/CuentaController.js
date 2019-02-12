var ResumenOrdenModule = angular.module('ResumenOrdenModule', []);

ResumenOrdenModule.controller('CtrlResumenOrden', ['$scope', '$http', '$window', '$interval', function ($scope, $http, $window, $interval) {

    var refresh = function () {
        // $http.get('/cocina').then(function (response) {
        //     ////console.log("Recibí la info que requerí.");
        //     $scope.cocinaList = response.data;
        // });


        $http.get('/Categoria/CategoriaSesionMesa').then(function (response) {
            //console.log(response.data.NumeroMesa);
            $scope.NumeroMesa = response.data.NumeroMesa;
        });

        $http.get('/Cuenta/CuentaDetalleCocina').then(function (response) {
            //console.log('Obteniendo items cocina');
            //Funcion map propia de los array, utilizada para asiganar la propiedad cantidad = 1 de todos los items del array.
            response.data.map(function (x) {
                x.cantidadAPagar = 0;
                return x
            });

            // var cocinaListTemp = response.data;
            // AsignaSubtotal(cocinaListTemp).then(function (val) {
            //     //console.log('Promesa cumplida Cocina');
            //     $scope.cocinaList = val;
            // }
            // );

            var cocinaListTemp = response.data;
            for (var i = 0; i < cocinaListTemp.length; i++) {
                var product = cocinaListTemp[i];
                cocinaListTemp[i].subtotal = Math.round(product.subtotal * 100) / 100;
                //console.log('Realizando promesa');
                //console.log('---------');

            }
            //console.log('Promesa Terminada');
            $scope.cocinaList = cocinaListTemp;

        });

        $http.get('/Cuenta/CuentaDetalleBar').then(function (response) {
            //console.log('Obteniendo items bar');
            //Funcion map propia de los array, utilizada para asiganar la propiedad cantidad = 1 de todos los items del array.
            response.data.map(function (x) {
                x.cantidadAPagar = 0;
                return x
            });

            // var cocinaListTemp = response.data;
            // AsignaSubtotal(cocinaListTemp).then(function (val) {
            //     $scope.cocinaListBar = val;
            // }
            // );

            var cocinaListTemp = response.data;
            for (var i = 0; i < cocinaListTemp.length; i++) {
                var product = cocinaListTemp[i];
                cocinaListTemp[i].subtotal = Math.round(product.subtotal * 100) / 100;
                //console.log('Realizando promesa');
                //console.log('---------');

            }
            //console.log('Promesa Terminada');
            $scope.cocinaListBar = cocinaListTemp;
        });
    };
    refresh();

    function AsignaSubtotal(cocinaListTemp) {
        return new Promise(
            function (resolve, reject) {
                for (var i = 0; i < cocinaListTemp.length; i++) {
                    var product = cocinaListTemp[i];
                    cocinaListTemp[i].subtotal = Math.round(product.subtotal * 100) / 100;
                    //console.log('Realizando promesa');
                    //console.log('---------');

                }

                resolve(cocinaListTemp);
            }
        )
    }

    $scope.getTotal = function () {
        var total = 0;
        //console.log('getTotal');
        if ($scope.cocinaList != null && $scope.cocinaListBar != null) {
            for (var i = 0; i < $scope.cocinaList.length; i++) {
                var product = $scope.cocinaList[i];
                total += (product.precio * (product.cantidad - product.cantidadEliminada));
            }

            for (var i = 0; i < $scope.cocinaListBar.length; i++) {
                var product = $scope.cocinaListBar[i];
                total += (product.precio * (product.cantidad - product.cantidadEliminada));
            }
        }


        return total;
    };

    $scope.getTotalPendiente = function () {
        var total = 0;
        //console.log('getTotalPendiente');
        if ($scope.cocinaList != null && $scope.cocinaListBar != null) {
            for (var i = 0; i < $scope.cocinaList.length; i++) {
                var product = $scope.cocinaList[i];
                total += (product.precio * (product.cantidad - product.cantidadPagada - product.cantidadEliminada));
            }

            for (var i = 0; i < $scope.cocinaListBar.length; i++) {
                var product = $scope.cocinaListBar[i];
                total += (product.precio * (product.cantidad - product.cantidadPagada - product.cantidadEliminada));
            }
        }
        return total;
    };

    $scope.getTotalPagado = function () {
        var total = 0;
        //console.log('getTotalPagado');
        if ($scope.cocinaList != null && $scope.cocinaListBar != null) {
            for (var i = 0; i < $scope.cocinaList.length; i++) {
                var product = $scope.cocinaList[i];
                total += (product.precio * (product.cantidadPagada));
            }

            for (var i = 0; i < $scope.cocinaListBar.length; i++) {
                var product = $scope.cocinaListBar[i];
                total += (product.precio * (product.cantidadPagada));
            }
        }
        return total;
    };


    $scope.enviarOrden = function () {
        //console.log("Enviar orden");
        //console.log($scope.cocinaList);
        var PlatosBebidas = $scope.cocinaList.concat($scope.cocinaListBar);
        //console.log("Platos bebidas");
        //console.log(PlatosBebidas);
        $http.put('/ResumenOrdenDetalle', PlatosBebidas).then(function (response) {
            refresh();
        });
    };

    $scope.cerrar = function () {
        $http.put('/Cuenta/Cerrar').then(function (res) {
            $window.location.href = res.data.redireccionar;
        });
    };

    $scope.agregar = function () {
        $http.post('/ResumenOrden/ResumenOrdenDetalleAgregar', $scope.Mesa).then(function (res) {
            $window.location.href = res.data.redireccionar;
        });
    };

    $scope.pagarOrden = function () {
        $http.put('/Cuenta/CuentaPagarOrden', $scope.cocinaList).then(function (response) {
            $window.location.href = response.data.redireccionar;
        });
    };

    $scope.eliminarItem = function (cocina) {
        $scope.Item = { idDetalleOrdenMesa: cocina.idDetalleOrdenMesa, cantidadEliminada: cocina.cantidadAPagar };
        $http.put('/Cuenta/EliminarItem', $scope.Item).then(function (res) {
            refresh();
        });
    };

    $scope.pagarItem = function (cocina) {
        $scope.Item = { idDetalleOrdenMesa: cocina.idDetalleOrdenMesa, cantidadPagada: cocina.cantidadAPagar };
        //console.log($scope.Item);
        $http.put('/Cuenta/PagarItem', $scope.Item).then(function (res) {
            refresh();
        });
    };

    $scope.clear = function () {
        refresh();
    }
    // $scope.contactList = contactList;
    //console.log("Hello World from controller");



    var vm = this;
    vm.submit = function () { //function to call on form submit
        //console.log("paso 1");
        //console.log(vm.upload_form);
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            //console.log("paso 2");
            vm.upload(vm.file); //call upload function
        }
    }
    function subir(file, callback) {
        Upload.upload({
            url: 'http://localhost:4200/upload', //webAPI exposed to upload the file
            data: { file: file } //pass file as data, should be user ng-model
        });

        callback();
    };

    //Ini Logica para spinner de cantidadAPagar
    var promesa;

    $scope.incrementar = function (cocina) {
        if (cocina.cantidadAPagar == null) {
            cocina.cantidadAPagar = 1;
        }
        // console.log("cantidadAPagar: " + cocina.cantidadAPagar);
        if (cocina.cantidad - cocina.cantidadPagada - cocina.cantidadEliminada > cocina.cantidadAPagar) {
            cocina.cantidadAPagar = cocina.cantidadAPagar + 1;
        }
        //console.log("cantidadAPagar actualizada: " + cocina.cantidadAPagar);
        //console.log($scope);
        //console.log($scope.cocina);

    };

    $scope.incrementar10 = function (cocina) {
        if (cocina.cantidadAPagar == null) {
            cocina.cantidadAPagar = 1;
        }
        if (cocina.cantidad - cocina.cantidadPagada - cocina.cantidadEliminada > cocina.cantidadAPagar + 10) {
            cocina.cantidadAPagar = cocina.cantidadAPagar + 10;
        }
    };

    $scope.decrementar10 = function (cocina) {
        if (cocina.cantidadAPagar == null) {
            cocina.cantidadAPagar = 1;
        }
        if (cocina.cantidadAPagar < 10) {
            cocina.cantidadAPagar = 0;
        }
        else {
            cocina.cantidadAPagar = cocina.cantidadAPagar - 10;
        }
    };

    $scope.mouseDown = function (cocina, direccion) {
        promesa = $interval(function () {
            if (cocina.cantidadAPagar == null) {
                cocina.cantidadAPagar = 1;
            }
            //console.log("cantidadAPagar: " + cocina.cantidadAPagar);
            if (direccion == "up") {
                cocina.cantidadAPagar = cocina.cantidadAPagar + 1;
            }
            else {
                if (cocina.cantidadAPagar > 0) {
                    cocina.cantidadAPagar = cocina.cantidadAPagar - 1;
                }
            }

            //console.log("cantidadAPagar actualizada: " + cocina.cantidadAPagar);
            //console.log($scope);
            //console.log($scope.cocina);

        }, 300);
    };

    $scope.mouseUp = function (cocina) {
        $interval.cancel(promesa);
    };
    //Fin Logica para spinner de cantidadAPagar
}]);

