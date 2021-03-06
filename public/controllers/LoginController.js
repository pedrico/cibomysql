var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {


    $scope.Login = function () {
        var usuario = $scope.usuario.usuario;
        var pass = $scope.usuario.pass;
        // Se validan credenciales
        $http.post('CatUsuario/usuario/' + usuario + '/' + pass).then(function (response) {
            $scope.entrar = response.data;

            if ($scope.entrar.redireccionar != null) {
                console.log("Ingresando");
                $window.location.href = $scope.entrar.redireccionar;
            }
            else {
                console.log("Credenciales invalidas");
                $scope.alerta = { mensaje: "Credenciales incorrectas, vuelva a intentarlo por favor.", visible: true };
            }

            // if ($scope.entrar != null && $scope.entrar.length > 0){                
            //     $http.post('Login/login', $scope.entrar[0]).then(function(res){
            //         $window.location.href= res.data.redireccionar;
            //     });
            // }


        });
    };


}]);

