var myApp = angular.module('IngreCocinaModule', ['ngFileUpload']);

myApp.controller('CtrlIngreCocina', ['$scope', '$http', 'Upload', '$window', function ($scope, $http, Upload, $window) {

    var refresh = function () {
        var idplato = getUrlParameter('plato');
        
        $http.get('/BarBebidaIngre/ListaGrid/' + idplato).then(function (response) {
            console.log("-------------Refresh" + idplato);
            console.log(response.data);
            $scope.IngreCocinaList = response.data;
            console.log($scope.IngreCocinaList);
            $scope.ShowAgregar = true;
            $scope.ShowActualizar = false;
            $scope.ShowLimpiar = true;
            //Limpia el contacto recien agregado
            $scope.cocina = null;
            vm.file = null;
            vm.progress = null;
        });

        //ComboBox
        $http.get('/BarBebidaIngre/Listaddl').then(function (response) {
            $scope.names = response.data;
        });
    };
    refresh();

    $scope.addContact = function () {
        if (angular.isUndefined($scope.ingreSeleccionado)) {
            $window.alert('Seleccione un ingrediente');
        }
        else {
            var idplato = getUrlParameter('plato');
            console.log($scope.ingreSeleccionado);
            $http.post('/BarBebidaIngre/' + idplato, $scope.ingreSeleccionado).then(function (response) {
                console.log(response);
                refresh();
            });
        }
    };

    $scope.remove = function (id) {
        var idplato = getUrlParameter('plato');
        console.log(id);
        $http.delete('/BarBebidaIngre/' + idplato+"/Ingrediente/"+id).then(function (response) {
            console.log("Actualiza despues de eliminar")
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
        $http.get('/RedirectIngreCocina').then(function (data, status) {

        });
    };

    $scope.update = function () {
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid            
            vm.upload(vm.file); //call upload function            
        }

        console.log($scope.cocina._id);
        $http.put('/cocina/' + $scope.cocina._id, $scope.cocina).then(function (response) {
            $scope.ShowAgregar = true;
            refresh();
        });
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
    vm.upload = function (file) {
        Upload.upload({
            url: 'http://localhost:4201/upload', //webAPI exposed to upload the file
            data: { file: file } //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if (resp.data.error_code === 0) { //validate success
                $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
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







}]);

