var CategoriaModule = angular.module('CategoriaModule', []);

CategoriaModule.controller('CtrlCategoria', ['$scope', '$http','$window', function ($scope, $http,$window) {
    
    var refresh = function () {
        console.log("categoria mesa");
        $http.get('Categoria/CategoriaSesionMesa').then(function (response) { 
            console.log(response.data.NumeroMesa) ;
            $scope.NumeroMesa = response.data.NumeroMesa;
        });

        $http.get('/UsrLogin').then(function (response) {             
            $scope.usuario = response.data.usuario;                    
        });
    };
    refresh();

    $scope.Cocina = function () {       
        $http.post('Categoria/CategoriaCocina', $scope.Mesa).then(function(res){
            $window.location.href= res.data.redireccionar;
        });
    };

    $scope.Bar = function () {       
        $http.post('Categoria/CategoriaBar', $scope.Mesa).then(function(res){
            $window.location.href= res.data.redireccionar;
        });
    };

    $scope.cambiarMesa = function () {        
        $http.post('Categoria/RedireccionarMesa').then(function (response) {
            $window.location.href= response.data.redireccionar;
        });
    };

    $scope.orden = function () {        
        $http.post('Categoria/RedireccionarOrden').then(function (response) {
            $window.location.href= response.data.redireccionar;
        });
    };

    $scope.cuentaOrden = function () {        
        $http.post('Categoria/RedireccionarCuentaOrden').then(function (response) {
            $window.location.href= response.data.redireccionar;
        });
    };

    $scope.cerrarSesion = function () {        
        $http.post('Categoria/CategoriaCerrarSesion').then(function (response) {
            $window.location.href= response.data.redireccionar;
        });
    };

}]);

