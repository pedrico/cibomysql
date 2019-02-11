var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http','$window', function ($scope, $http, $window) {

   
    $scope.Login = function(){        
        var usuario = $scope.usuario.usuario;
        var pass = $scope.usuario.pass;
        // Se validan credenciales
        $http.get('CatUsuario/usuario/' + usuario+'/'+ pass).then(function (response) {            
            $scope.entrar = response.data;                                    
            if ($scope.entrar != null && $scope.entrar.length > 0){
                console.log("No es null");
                $http.post('Login/login', $scope.entrar[0]).then(function(res){
                    $window.location.href= res.data.redireccionar;
                });
            }
            else{
                $scope.alerta = { mensaje: "Credenciales incorrectas, vuelva a intentarlo por favor.", visible: true };
            }

        });
    };   


}]);

