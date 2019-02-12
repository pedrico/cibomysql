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

    $scope.menu = function () {
        $http.post('/ResumenOrden/ResumenOrdenDetalleAgregar', $scope.Mesa).then(function (res) {
            $window.location.href = res.data.redireccionar;
        });
    };

}]);

