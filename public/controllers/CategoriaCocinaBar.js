var myApp = angular.module('myApp', ['ui.bootstrap']);

myApp.controller('AppCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    $scope.currentPage = 1;
    $scope.itemsPerPage = 5;
    $scope.maxSize = 5;
    $scope.tickets = [];
    $scope.bodynews = [];
    $scope.colores = ['#44ba5d', '#ffce34', '#a4e749', '#1e1919', '#694393', '#30746f', '#5bc33d', "#2292a4"];
    $scope.colores1 = ['#cddbda', '#4410c5', '#ffffff', '#dddf0c', '#93c2df'];
    $scope.colores2 = ['#385a7c', '#f97171', '#f99192', '#8ad6cc', '#b2eee6'];
    var begin;
    var end;
    var idSeccion;

    var refresh = function () {
        console.log("Antes de consultar");
        idSeccion = getUrlParameter('seccion');
        if (idSeccion == 1) {
            $http.get('CategoriaCocinaBar/Cocina').then(function (response) {
                console.log("Refresh");
                $scope.cocinaList = response.data;

            });
        } else if (idSeccion == 2) {
            $http.get('CategoriaCocinaBar/Bar').then(function (response) {
                console.log("Refresh");
                $scope.cocinaList = response.data;

            });
        }
    };


    refresh();

    $scope.ObtenerIndice = function (i) {
        var resultado = i - parseInt(i / $scope.colores.length) * $scope.colores.length;
        return resultado;
    };

    $scope.addContact = function () {
        console.log("paso 1");
        console.log(vm.upload_form);
        console.log($scope.categoriaSeleccionada);
        if (angular.isUndefined($scope.categoriaSeleccionada.id)) {
            $window.alert('Seleccione una categoría');
        }
        else {
            $scope.cocina.idCocinaCategoria = $scope.categoriaSeleccionada.id;
            console.log($scope.cocina);
            if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
                console.log("paso 2");
                subir(vm.file, function () {
                    console.log("despues de subir imagen")
                    console.log($scope.cocina);
                    $http.post('CatCocina/cocina', $scope.cocina).then(function (response) {
                        console.log(response);
                        refresh();
                    });
                }); //call upload function

            }
            else {
                //Si el usuario no selecciona imagen
                $http.post('CatCocina/cocinaNoImagen', $scope.cocina).then(function (response) {
                    console.log(response);
                    refresh();
                });
            }
        }
    };

    $scope.remove = function (id) {
        console.log(id);
        $http.delete('CatCocina/cocina/' + id).then(function (response) {
            refresh();
        });

    };

    $scope.edit = function (id) {
        console.log(id);
        $http.get('CatCocina/cocina/' + id).then(function (response) {
            console.log(response);
            $scope.cocina = response.data;
            console.log($scope.cocinaList);
            console.log($scope.categoriaSeleccionada);
            $scope.categoriaSeleccionada = { id: $scope.cocina.idCocinaCategoria };
            //$scope.categoriaSeleccionada.id = $scope.cocina.idCocinaCategoria;
            console.log($scope.categoriaSeleccionada.id);
            $scope.ShowAgregar = false;
            $scope.ShowActualizar = true;
            $scope.ShowLimpiar = true;
            if (response.data.imagen == null) {
                console.log("imagen null");
                $scope.up.file = null;
            }
            else {
                console.log("Con imagen");
                vm.file = "http://localhost:4201/" + response.data.imagen;
            }
        });
    };

    $scope.redireccionar = function (id) {
        console.log(id + "--hola");
        $http.get('CatCocina/RedirectIngreCocina').then(function (data, status) {

        });
    };

    $scope.update = function () {
        $scope.cocina.idCocinaCategoria = $scope.categoriaSeleccionada.id;
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid  
            console.log("entro if");
            subir(vm.file, function () {
                console.log($scope.cocina._id);
                $http.put('CatCocina/cocina/' + $scope.cocina._id, $scope.cocina).then(function (response) {
                    $scope.ShowAgregar = true;
                    refresh();
                });
            }); //call upload function            
        } else {
            console.log("entro a else");
            console.log(vm.file);
            $http.put('CatCocina/cocinaNoImagen/' + $scope.cocina._id, $scope.cocina).then(function (response) {
                $scope.ShowAgregar = true;
                refresh();
            });
        }
    };

    $scope.clear = function () {
        refresh();
    }

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

    $scope.items = function (itemCategoria) {
        if (idSeccion == 1) {
            $http.post('CategoriaCocinaBar/CategoriaCocina', itemCategoria).then(function (res) {
                $window.location.href = res.data.redireccionar + "?cat=" + itemCategoria.id;
            });
        } else if (idSeccion == 2) {
            $http.post('CategoriaCocinaBar/CategoriaBar', itemCategoria).then(function (res) {
                $window.location.href = res.data.redireccionar + "?cat=" + itemCategoria.id;
            });
        }
    };


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

