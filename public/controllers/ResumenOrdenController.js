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

        $http.get('/ResumenOrden/ResumenOrdenDetalle').then(function (response) {
            $scope.cocinaList = response.data;
        });

        $http.get('/ResumenOrden/ResumenOrdenDetalleBar').then(function (response) {
            $scope.cocinaListBar = response.data;
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
                $http.post('/cocina', $scope.cocina).then(function (response) {
                    console.log(response);
                    refresh();
                });
            }); //call upload function

        }
    };

    // $scope.remove = function (id) {
    //     console.log(id);
    //     $http.delete('/cocina/' + id).then(function (response) {
    //         refresh();
    //     });

    // };

    // $scope.edit = function (id) {
    //     console.log(id);
    //     $http.get('/cocina/' + id).then(function (response) {
    //         console.log(response);
    //         $scope.cocina = response.data;
    //         $scope.ShowAgregar = false;
    //         $scope.ShowActualizar = true;
    //         $scope.ShowLimpiar = true;
    //         vm.file = "http://localhost:4201/" + response.data.imagen;
    //     });
    // };

    // $scope.redireccionar = function (id) {
    //     console.log(id + "--hola");
    //     $http.get('/RedirectIngreCocina').then(function (data, status) {

    //     });
    // };

    $scope.enviarOrden = function () {
        console.log("Enviar orden");
        console.log($scope.cocinaList);
        var PlatosBebidas = $scope.cocinaList.concat($scope.cocinaListBar);
        console.log("Platos bebidas");
        console.log(PlatosBebidas);
        $http.put('/ResumenOrden/ResumenOrdenDetalle', PlatosBebidas).then(function (response) {
            refresh();
        });
    };

    $scope.agregar = function () {       
        $http.post('/ResumenOrden/ResumenOrdenDetalleAgregar', $scope.Mesa).then(function(res){
            $window.location.href= res.data.redireccionar;
        });
    };

    $scope.cancelarOrden = function () {                
        var PlatosBebidas = $scope.cocinaList.concat($scope.cocinaListBar);                
        $http.put('/ResumenOrden/ResumenOrdenDetalleCancelar', PlatosBebidas).then(function (response) {
            $window.location.href= response.data.redireccionar;
        });
    };

    $scope.eliminar = function (id) {         
        console.log(id);
        $http.delete('/ResumenOrden/ResumenOrdenDetalleEliminar/'+ id).then(function(response){
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
            url: 'http://localhost:4201/upload', //webAPI exposed to upload the file
            data: { file: file } //pass file as data, should be user ng-model
        });

        callback();
    };
}]);

