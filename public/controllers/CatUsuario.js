var myApp = angular.module('myApp', ['ui.bootstrap']);

myApp.controller('AppCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    $scope.currentPage = 1;
    $scope.itemsPerPage = 5;
    $scope.maxSize = 5;
    $scope.tickets = [];
    $scope.bodynews = [];
    var begin;
    var end;

    var refresh = function () {
        $http.get('CatUsuario/usuario').then(function (response) {
            console.log("Recibí la info que requerí.");
            $scope.cocinaList = response.data;
            $scope.ShowAgregar = true;
            $scope.ShowActualizar = false;
            $scope.ShowLimpiar = true;
            //Limpia el contacto recien agregado
            $scope.cocina = {};
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

        $http.get('CatUsuario/roles').then(function (response) {
            $scope.roles = response.data;
        });

    };


    refresh();

    $scope.addContact = function () {
        if (angular.isUndefined($scope.cocina.idRol)) {
            $window.alert('Seleccione un rol');
        }
        else {
            $http.post('CatUsuario/usuario', $scope.cocina).then(function (response) {
                console.log(response);
                refresh();
            });
        }
    };

    $scope.remove = function (id) {
        console.log(id);
        $http.delete('CatUsuario/usuario/' + id).then(function (response) {
            refresh();
        });

    };

    $scope.edit = function (id) {
        $http.get('CatUsuario/usuario/' + id).then(function (response) {
            console.log(response);
            $scope.cocina = response.data;
            $scope.ShowAgregar = false;
            $scope.ShowActualizar = true;
            $scope.ShowLimpiar = true;
        });
    };

    $scope.redireccionar = function (id) {
        console.log(id + "--hola");
        $http.get('/RedirectIngreCocina').then(function (data, status) {

        });
    };

    $scope.update = function () {
        console.log($scope.cocina.id);
        $http.put('CatUsuario/usuario/' + $scope.cocina.id, $scope.cocina).then(function (response) {
            $scope.ShowAgregar = true;
            refresh();
        });
    };

    $scope.clear = function () {
        console.log("Limpiando");
        $scope.cocina = {};
    }

}]);

