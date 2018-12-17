var SeleccionMesaModule = angular.module('SeleccionMesaModule', []);

SeleccionMesaModule.controller('CtrlSeleccionMesa', ['$scope', '$http','$window', function ($scope, $http,$window) {
    
    var refresh = function () {        
        $scope.Mesa = {NumeroMesa: ""};
        var variableMesa = $scope.Mesa;
        console.log(variableMesa);
        console.log(variableMesa.NumeroMesa);
        console.log($scope.Mesa);
        console.log($scope.Mesa.NumeroMesa);

        $http.get('/UsrLogin').then(function (response) { 
            console.log("Obtener usuario");           
            $scope.usuario = response.data.usuario;
            console.log($scope.usuario);
        });
    };
    refresh();

    $scope.push0 = function () {
        console.log($scope.Mesa.NumeroMesa);
        $scope.Mesa.NumeroMesa = $scope.Mesa.NumeroMesa + "0";
        console.log($scope.Mesa);
    };
    $scope.push1 = function () {
        $scope.Mesa.NumeroMesa = $scope.Mesa.NumeroMesa + "1";
    };
    $scope.push2 = function () {
        $scope.Mesa.NumeroMesa = $scope.Mesa.NumeroMesa + "2";
    };
    $scope.push3 = function () {
        $scope.Mesa.NumeroMesa = $scope.Mesa.NumeroMesa + "3";
    };
    $scope.push4 = function () {
        $scope.Mesa.NumeroMesa = $scope.Mesa.NumeroMesa + "4";
    };
    $scope.push5 = function () {
        $scope.Mesa.NumeroMesa = $scope.Mesa.NumeroMesa + "5";
    };
    $scope.push6 = function () {
        $scope.Mesa.NumeroMesa = $scope.Mesa.NumeroMesa + "6";
    };
    $scope.push7 = function () {
        $scope.Mesa.NumeroMesa = $scope.Mesa.NumeroMesa + "7";
    };
    $scope.push8 = function () {
        $scope.Mesa.NumeroMesa = $scope.Mesa.NumeroMesa + "8";
    };
    $scope.push9 = function () {
        $scope.Mesa.NumeroMesa = $scope.Mesa.NumeroMesa + "9";
    };

    $scope.Limpiar = function () {
        $scope.Mesa.NumeroMesa = "";
    };

    $scope.Eliminar = function () {
        var strNumeroMesa = $scope.Mesa.NumeroMesa;

        $scope.Mesa.NumeroMesa = strNumeroMesa.substring(0,strNumeroMesa.length-1);
    };

    $scope.Continuar = function () {       
        $http.post('/SeleccionMesa', $scope.Mesa).then(function(res){
            $window.location.href= res.data.redireccionar;
        });
    };

    $scope.remove = function(id){
        console.log(id);
        $http.delete('/cocina/'+ id).then(function(response){
            refresh();
        }) ;

    };


}]);

