

function ObtenerAccesos($http, callback) {
    $http.get('/Accesos').then(function (response) {
        console.log("Segunda llamada");
        console.log(response.data);
        callback(response.data);
    });
}

myApp.controller('AppAccesos', ['$scope', '$http', function ($scope, $http) {
    var arrayAccesos = [];
    ObtenerAccesos($http, (response) => {
        $scope.accesos = response;
        console.log($scope.accesos.filter(e => e.id == 1).length > 0);
        response.forEach(convertirArreglo);
        $scope.accesos = arrayAccesos;

        console.log("Accesos array");
        console.log($scope.accesos);

    });

    function convertirArreglo(value, index, array) {
        arrayAccesos.push(value.id);
    }

}]);