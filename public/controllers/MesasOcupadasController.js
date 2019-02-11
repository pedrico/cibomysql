var myApp = angular.module('myApp', ['ngFileUpload', 'ui.bootstrap']);

myApp.controller('AppCtrl', ['$scope', '$http', 'Upload', '$window', function ($scope, $http, Upload, $window) {

    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
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
        $http.get('/MesasOcupadas/Listado').then(function (response) {
            $scope.cocinaList = response.data;
            $scope.ShowAgregar = true;
            $scope.ShowActualizar = false;
            $scope.ShowLimpiar = true;
            //Limpia el contacto recien agregado
            $scope.cocina = null;


            /**Paginacion */
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


    $scope.cuenta = function (id) {
        $scope.Mesa = { NumeroMesa: id };
        $http.post('/MesasOcupadas/RedireccionarCuentaOrden/',$scope.Mesa).then(function (response) {            
            $window.location.href = response.data.redireccionar;
        });
    };

    $scope.cerrar = function (id) {
        $scope.Mesa = { NumeroMesa: id };
        $http.put('/MesasOcupadas/Cerrar', $scope.Mesa).then(function (res) {
            $window.location.href = res.data.redireccionar;
        });
    };

    $scope.pagar = function (id) {
        $scope.Mesa = { NumeroMesa: id };
        $http.put('/MesasOcupadas/Pagar', $scope.Mesa).then(function (res) {
            $window.location.href = res.data.redireccionar;
        });

    };


    refresh();


    $scope.remove = function (id) {
        console.log(id);
        $http.delete('/cocina/' + id).then(function (response) {
            refresh();
        });

    };

    $scope.edit = function (id) {
        console.log(id);
        $http.get('/cocina/' + id).then(function (response) {
            console.log(response);
            $scope.cocina = response.data;
            $scope.ShowAgregar = false;
            $scope.ShowActualizar = true;
            $scope.ShowLimpiar = true;
            vm.file = "http://localhost:4200/" + response.data.imagen;
        });
    };

    $scope.redireccionar = function (id) {
        console.log(id + "--hola");
        $http.get('/RedirectIngreCocina').then(function (data, status) {

        });
    };

    $scope.clear = function () {
        refresh();
    }

}]);

