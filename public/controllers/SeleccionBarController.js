var myApp = angular.module('myApp', ['ngFileUpload']);

myApp.controller('AppCtrl', ['$scope', '$http', 'Upload', '$window', '$interval', function ($scope, $http, Upload, $window, $interval) {

    var refresh = function () {
        var idCategoria = getUrlParameter('cat');
        var categoria = { idCategoria: idCategoria };
        $http.post('/SeleccionBar/bar', categoria).then(function (response) {
            //console.log("Recibí la info que requerí.");

            //Funcion map propia de los array, utilizada para asiganar la propiedad cantidad = 1 de todos los items del array.
            response.data.map(function (x) {
                x.cantidad = 1;
                return x;
            });

            $scope.barList = response.data;
            $scope.alert = { message: '', closable: true };
            console.log($scope.alert);
        });

        $http.get('/Categoria/CategoriaSesionMesa').then(function (response) {
            console.log(response.data.NumeroMesa);
            $scope.NumeroMesa = response.data.NumeroMesa;
        });
    };
    refresh();


    var OcultarAlerta = function () {
        $scope.alerta = { mensaje: '', visible: false };
    };
    OcultarAlerta();

    $scope.addItem = function (id, cantidad) {
        var DetalleOrdenMesa = { iditembar: id, cantidad: cantidad }
        console.log("Agregar Item");
        $http.post('/SeleccionBar', DetalleOrdenMesa).then(function (response) {
            $scope.alerta = { mensaje: response.data.cantidad + " " + response.data.nombre, visible: true };
            refresh();
        });
    };

    $scope.remove = function (id) {
        console.log(id);
        $http.delete('/bar/' + id).then(function (response) {
            refresh();
        });

    };

    $scope.edit = function (id) {
        console.log(id);
        $http.get('/bar/' + id).then(function (response) {
            console.log(response);
            $scope.bar = response.data;
            $scope.ShowAgregar = false;
            $scope.ShowActualizar = true;
            $scope.ShowLimpiar = true;
            vm.file = "http://localhost:4201/" + response.data.imagen;
        });
    };

    $scope.redireccionar = function (id) {
        console.log(id + "--hola");
        $http.get('/RedirectIngreBar').then(function (data, status) {

        });
    };

    $scope.menu = function () {
        $http.post('/ResumenOrden/ResumenOrdenDetalleAgregar', $scope.Mesa).then(function (res) {
            $window.location.href = res.data.redireccionar;
        });
    };

    $scope.cambiarMesa = function () {
        $http.post('/SeleccionBar/RedireccionarMesa').then(function (response) {
            $window.location.href = response.data.redireccionar;
        });
    };

    $scope.orden = function () {
        $http.post('/SeleccionBar/RedireccionarOrden').then(function (response) {
            $window.location.href = response.data.redireccionar;
        });
    };

    $scope.cuentaOrden = function () {
        $http.post('/SeleccionBar/RedireccionarCuentaOrden').then(function (response) {
            $window.location.href = response.data.redireccionar;
        });
    };

    $scope.platos = function () {
        $http.post('/Categoria/CategoriaCocina').then(function (response) {
            $window.location.href = response.data.redireccionar;
        });
    };

    $scope.update = function () {
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid  
            console.log("entro if");
            subir(vm.file, function () {
                console.log($scope.bar._id);
                $http.put('/bar/' + $scope.bar._id, $scope.bar).then(function (response) {
                    $scope.ShowAgregar = true;
                    refresh();
                });
            }); //call upload function            
        } else {
            console.log("entro a else");
            console.log(vm.file);
            $http.put('/barN/' + $scope.bar._id, $scope.bar).then(function (response) {
                $scope.ShowAgregar = true;
                refresh();
            });
        }
    };

    $scope.clear = function () {
        refresh();
    }
    // $scope.contactList = contactList;
    console.log("Hello World from controller");



    var vm = this;
    vm.submit = function () { //function to call on form submit
        console.log("paso 1");
        console.log(vm.upload_form);
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            console.log("paso 2");
            vm.upload(vm.file); //call upload function
        }
    }
    function subir(file, callback) {
        Upload.upload({
            url: 'http://localhost:4201/upload', //webAPI exposed to upload the file
            data: { file: file } //pass file as data, should be user ng-model
        });

        callback();
    };


    //Ini Logica para spinner de cantidad
    var promesa;

    $scope.incrementar = function (cocina) {
        if (cocina.cantidad == null) {
            cocina.cantidad = 1;
        }
        console.log("Cantidad: " + cocina.cantidad);
        cocina.cantidad = cocina.cantidad + 1;
        console.log("Cantidad actualizada: " + cocina.cantidad);
        console.log($scope);
        console.log($scope.cocina);

    };

    $scope.incrementar10 = function (cocina) {
        if (cocina.cantidad == null) {
            cocina.cantidad = 1;
        }
        cocina.cantidad = cocina.cantidad + 10;
    };

    $scope.decrementar10 = function (cocina) {
        if (cocina.cantidad == null) {
            cocina.cantidad = 1;
        }
        if (cocina.cantidad < 11) {
            cocina.cantidad = 1;
        }
        else {
            cocina.cantidad = cocina.cantidad - 10;
        }
    };

    $scope.mouseDown = function (cocina, direccion) {
        promesa = $interval(function () {
            if (cocina.cantidad == null) {
                cocina.cantidad = 1;
            }
            console.log("Cantidad: " + cocina.cantidad);
            if (direccion == "up") {
                cocina.cantidad = cocina.cantidad + 1;
            }
            else {
                if (cocina.cantidad > 1) {
                    cocina.cantidad = cocina.cantidad - 1;
                }
            }

            console.log("Cantidad actualizada: " + cocina.cantidad);
            console.log($scope);
            console.log($scope.cocina);

        }, 300);
    };


    $scope.mouseUp = function (cocina) {
        $interval.cancel(promesa);
    };
    //Fin Logica para spinner de cantidad

    function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        console.log("Obteniendo parametros-----------------");
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };
}]);

