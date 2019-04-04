var myApp = angular.module('IngredienteModule', ['ngFileUpload']);

myApp.controller('CtrlIngrediente', ['$scope', '$http','Upload','$window', function ($scope, $http,Upload,$window) {
    
    var refresh = function () {
        $http.get('CatBarIngre/ingrediente').then(function (response) {
            //console.log("Recibí la info que requerí.");
            $scope.cocinaList = response.data;
            $scope.ShowAgregar = true;
            $scope.ShowActualizar = false;
            $scope.ShowLimpiar = true;
            //Limpia el contacto recien agregado
            $scope.cocina = null;
            $scope.up.file = null;
            vm.progress = null;
        });
    };
    refresh();

    $scope.addContact = function () {
        console.log("paso 1");
        console.log(vm.upload_form);
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            console.log("paso 2");
            subir(vm.file, function(){
                console.log("despues de subir imagen")
                $http.post('CatBarIngre/ingrediente', $scope.cocina).then(function (response) {
                    console.log(response);
                    refresh();
                });   
            }); //call upload function
            
        }
        else {
            //Si el usuario no selecciona imagen
            $http.post('CatBarIngre/ingredienteNoImagen', $scope.cocina).then(function (response) {
                console.log(response);
                refresh();
            });
        }
    };

    $scope.remove = function(id){
        console.log(id);
        $http.delete('CatBarIngre/ingrediente/'+ id).then(function(response){
            refresh();
        }) ;

    };

    $scope.edit = function(id){
        console.log(id);
        $http.get('CatBarIngre/ingrediente/'+ id).then(function(response){
            console.log(response);
            $scope.cocina = response.data;
            $scope.ShowAgregar = false;
            $scope.ShowActualizar = true;
            $scope.ShowLimpiar = true;
            if (response.data.imagen == null) {
                console.log("imagen null");                
                $scope.up.file = null;
            }
            else {
                console.log("Con imagen");
                vm.file = "http://localhost:4201/" + response.data.imagen;
            }
        });
    };

    $scope.update = function(){
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid  
            console.log("entro if");
            subir(vm.file, function(){
                console.log($scope.cocina._id);
                $http.put('CatBarIngre/ingrediente/'+ $scope.cocina._id, $scope.cocina).then(function(response){
                    $scope.ShowAgregar = true;
                    refresh();
                });        
            }); //call upload function            
        }else{
            console.log("entro a else");
            console.log(vm.file);
            $http.put('CatBarIngre/ingredienteNoImagen/'+ $scope.cocina._id, $scope.cocina).then(function(response){
                $scope.ShowAgregar = true;
                refresh();
            }); 
        }        
    };

    $scope.clear = function(){
        refresh();  
    }
   
    var vm = this;
    vm.submit = function(){ //function to call on form submit
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
            data:{file:file} //pass file as data, should be user ng-model
        });

        callback();
    };
}]);

