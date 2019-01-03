var myApp = angular.module('myApp', ['ngFileUpload']);

myApp.controller('AppCtrl', ['$scope', '$http', 'Upload', '$window', function ($scope, $http, Upload, $window) {

    var refresh = function () {
        $http.get('/CatCocina/cocina').then(function (response) {
            //console.log("Recibí la info que requerí.");
            $scope.cocinaList = response.data;
            $scope.alert = { message: 'hola', closable: true };
            console.log($scope.alert);
        });

        $http.get('/Categoria/CategoriaSesionMesa').then(function (response) {
            console.log(response.data.NumeroMesa);
            $scope.NumeroMesa = response.data.NumeroMesa;
        });
    };
    refresh();
    

    var OcultarAlerta = function(){
        $scope.alerta = { mensaje: '', visible: false };            
    };
    OcultarAlerta();

    $scope.addItem = function (id) {
        var DetalleOrdenMesa = { iditemcocina: id }
        console.log("Agregar Item");
        $http.post('/SeleccionCocina', DetalleOrdenMesa).then(function (response) {            
            $scope.alerta = { mensaje: response.data.nombre, visible: true };            
            refresh();
        });
    };

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
            vm.file = "http://localhost:4201/" + response.data.imagen;
        });
    };

    $scope.redireccionar = function (id) {
        console.log(id + "--hola");
        $http.get('/SeleccionCocina/RedirectIngreCocina').then(function (data, status) {

        });
    };

    $scope.cambiarMesa = function () {        
        $http.post('/SeleccionCocina/RedireccionarMesa').then(function (response) {
            $window.location.href= response.data.redireccionar;
        });
    };

    $scope.orden = function () {        
        $http.post('/SeleccionCocina/RedireccionarOrden').then(function (response) {
            $window.location.href= response.data.redireccionar;
        });
    };

    $scope.cuentaOrden = function () {        
        $http.post('/SeleccionCocina/RedireccionarCuentaOrden').then(function (response) {
            $window.location.href= response.data.redireccionar;
        });
    };

    $scope.bebidas = function () {        
        $http.post('/SeleccionCocina/RedireccionarBebidas').then(function (response) {
            $window.location.href= response.data.redireccionar;
        });
    };
    
    $scope.update = function () {
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid  
            console.log("entro if");
            subir(vm.file, function () {
                console.log($scope.cocina._id);
                $http.put('/cocina/' + $scope.cocina._id, $scope.cocina).then(function (response) {
                    $scope.ShowAgregar = true;
                    refresh();
                });
            }); //call upload function            
        } else {
            console.log("entro a else");
            console.log(vm.file);
            $http.put('/cocinaN/' + $scope.cocina._id, $scope.cocina).then(function (response) {
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
}]);

