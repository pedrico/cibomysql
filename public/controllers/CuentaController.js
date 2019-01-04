var ResumenOrdenModule = angular.module('ResumenOrdenModule', []);

ResumenOrdenModule.controller('CtrlResumenOrden', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    var refresh = function () {
        // $http.get('/cocina').then(function (response) {
        //     //console.log("Recibí la info que requerí.");
        //     $scope.cocinaList = response.data;
        // });
        $http.get('/Categoria/CategoriaSesionMesa').then(function (response) {
            console.log(response.data.NumeroMesa);
            $scope.NumeroMesa = response.data.NumeroMesa;
        });

        $http.get('/Cuenta/CuentaDetalleCocina').then(function (response) {
            $scope.cocinaList = response.data;
            for(var i = 0; i < $scope.cocinaList.length; i++){
                var product = $scope.cocinaList[i];
                $scope.cocinaList[i].subtotal = Math.round( product.subtotal*100)/100;
            }
        });

        $http.get('/Cuenta/CuentaDetalleBar').then(function (response) {
            $scope.cocinaListBar = response.data;
            for(var i = 0; i < $scope.cocinaListBar.length; i++){
                var product = $scope.cocinaListBar[i];
                $scope.cocinaListBar[i].subtotal = Math.round( product.subtotal*100)/100;
            }
        });
    };
    refresh();

    $scope.getTotal = function(){
        var total = 0;
        for(var i = 0; i < $scope.cocinaList.length; i++){
            var product = $scope.cocinaList[i];
            total += (product.subtotal);
        }

        for(var i = 0; i < $scope.cocinaListBar.length; i++){
            var product = $scope.cocinaListBar[i];
            total += (product.subtotal);
        }

        return total;
    }


    $scope.enviarOrden = function () {
        console.log("Enviar orden");
        console.log($scope.cocinaList);
        var PlatosBebidas = $scope.cocinaList.concat($scope.cocinaListBar);
        console.log("Platos bebidas");
        console.log(PlatosBebidas);
        $http.put('/ResumenOrdenDetalle', PlatosBebidas).then(function (response) {
            refresh();
        });
    };

    $scope.agregar = function () {       
        $http.post('/ResumenOrden/ResumenOrdenDetalleAgregar', $scope.Mesa).then(function(res){
            $window.location.href= res.data.redireccionar;
        });
    };

    $scope.pagarOrden = function () {       
        $http.put('/Cuenta/CuentaPagarOrden', $scope.cocinaList).then(function (response) {
            $window.location.href= response.data.redireccionar;
        });
    };

    $scope.eliminar = function (id) {               
        $http.put('/ResumenOrdenDetalleEliminar/'+ id).then(function(response){
            refresh();
        }) ;
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
            url: 'http://localhost:4200/upload', //webAPI exposed to upload the file
            data: { file: file } //pass file as data, should be user ng-model
        });

        callback();
    };
}]);

