var myApp = angular.module('myApp', ['ngFileUpload', 'ui.bootstrap']);

myApp.controller('AppCtrl', ['$scope', '$http', 'Upload', '$window', function ($scope, $http, Upload, $window) {

    $scope.currentPage = 1;
    $scope.itemsPerPage = 5;
    $scope.maxSize = 5;
    $scope.tickets = [];
    $scope.bodynews = [];
    var begin;
    var end;

    $scope.$watch('currentPage', function () {
        begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
        end = begin + $scope.itemsPerPage;
        $scope.paged = {
            bodynews: $scope.bodynews.slice(begin, end)
        }
    });

    var refresh = function () {
        $http.get('CatCocina/cocina').then(function (response) {
            $scope.cocinaList = response.data;
            $scope.ShowAgregar = true;
            $scope.ShowActualizar = false;
            $scope.ShowLimpiar = true;
            //Limpia el contacto recien agregado
            $scope.cocina = null;
            vm.file = null;
            vm.progress = null;

            //Paginacion           
            $scope.tickets = $scope.cocinaList;

            for (i = 0; i < $scope.tickets.length; i++) {

                $scope.bodynews[i] = $scope.tickets[i];

            }
            console.log($scope.tickets.length);
            console.log($scope.itemsPerPage);
            $scope.noOfPages = Math.floor($scope.tickets.length / $scope.itemsPerPage);

            begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
            end = begin + $scope.itemsPerPage;
            $scope.paged = {
                bodynews: $scope.bodynews.slice(begin, end)
            }
        });
    };


    refresh();

    $scope.addContact = function () {
        console.log("paso 1");
        console.log(vm.upload_form);
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
            $scope.ShowAgregar = false;
            $scope.ShowActualizar = true;
            $scope.ShowLimpiar = true;
            vm.file = "http://localhost:4201/" + response.data.imagen;
        });
    };

    $scope.redireccionar = function (id) {
        console.log(id + "--hola");
        $http.get('CatCocina/RedirectIngreCocina').then(function (data, status) {

        });
    };

    $scope.update = function () {
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




}]);

