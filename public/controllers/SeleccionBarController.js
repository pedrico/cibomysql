var myApp = angular.module('myApp', ['ngFileUpload']);

myApp.controller('AppCtrl', ['$scope', '$http', 'Upload', '$window', function ($scope, $http, Upload, $window) {

    var refresh = function () {
        $http.get('/CatBar/bar').then(function (response) {
            //console.log("Recibí la info que requerí.");
            $scope.barList = response.data;
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
        var DetalleOrdenMesa = { iditembar: id }
        console.log("Agregar Item");
        $http.post('/SeleccionBar', DetalleOrdenMesa).then(function (response) {            
            $scope.alerta = { mensaje: response.data.nombre, visible: true };            
            refresh();
        });
    };

    $scope.remove = function (id) {
        console.log(id);
        $http.delete('/bar/' + id).then(function (response) {
            refresh();
        });

    };

    $scope.edit = function (id) {
        console.log(id);
        $http.get('/bar/' + id).then(function (response) {
            console.log(response);
            $scope.bar = response.data;
            $scope.ShowAgregar = false;
            $scope.ShowActualizar = true;
            $scope.ShowLimpiar = true;
            vm.file = "http://localhost:4201/" + response.data.imagen;
        });
    };

    $scope.redireccionar = function (id) {
        console.log(id + "--hola");
        $http.get('/RedirectIngreBar').then(function (data, status) {

        });
    };

    $scope.cambiarMesa = function () {        
        $http.post('/SeleccionBar/RedireccionarMesa').then(function (response) {
            $window.location.href= response.data.redireccionar;
        });
    };

    $scope.orden = function () {        
        $http.post('/SeleccionBar/RedireccionarOrden').then(function (response) {
            $window.location.href= response.data.redireccionar;
        });
    };

    $scope.cuentaOrden = function () {        
        $http.post('/SeleccionBar/RedireccionarCuentaOrden').then(function (response) {
            $window.location.href= response.data.redireccionar;
        });
    };

    $scope.platos = function () {        
        $http.post('/SeleccionBar/RedireccionarPlatos').then(function (response) {
            $window.location.href= response.data.redireccionar;
        });
    };

    $scope.update = function () {
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid  
            console.log("entro if");
            subir(vm.file, function () {
                console.log($scope.bar._id);
                $http.put('/bar/' + $scope.bar._id, $scope.bar).then(function (response) {
                    $scope.ShowAgregar = true;
                    refresh();
                });
            }); //call upload function            
        } else {
            console.log("entro a else");
            console.log(vm.file);
            $http.put('/barN/' + $scope.bar._id, $scope.bar).then(function (response) {
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

