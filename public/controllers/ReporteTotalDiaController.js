//import { saveAs } from 'file-saver/FileSaver';
var ReporteTotalDiaModule = angular.module('ReporteTotalDiaModule', []);

ReporteTotalDiaModule.controller('CtrlReporteTotalDia', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    var refresh = function () {

        // $http.get('/ReporteTotalDiaDetalleCocina').then(function (response) {
        //     $scope.cocinaList = response.data;
        //     for(var i = 0; i < $scope.cocinaList.length; i++){
        //         var product = $scope.cocinaList[i];
        //         $scope.cocinaList[i].subtotal = Math.round( product.subtotal*100)/100;
        //     }
        // });

        // $http.get('/ReporteTotalDiaDetalleBar').then(function (response) {
        //     $scope.cocinaListBar = response.data;
        //     for(var i = 0; i < $scope.cocinaListBar.length; i++){
        //         var product = $scope.cocinaListBar[i];
        //         $scope.cocinaListBar[i].subtotal = Math.round( product.subtotal*100)/100;
        //     }
        // });
    };
    refresh();

    $scope.getTotal = function () {
        if ($scope.cocinaList == undefined || $scope.cocinaListBar == undefined) {
            return 0;
        }

        var total = 0;
        for (var i = 0; i < $scope.cocinaList.length; i++) {
            var product = $scope.cocinaList[i];
            total += (product.subtotal);
        }

        for(var i = 0; i < $scope.cocinaListBar.length; i++){
            var product = $scope.cocinaListBar[i];
            total += (product.subtotal);
        }

        return total;
    }

    var fechaIni;
    var fechaFin;
    var horaIni;
    var horaFin;

    $scope.Consultar = function () {
        console.log($scope.filtros);
        // fechaIni = $scope.filtros.fechaini;
        // fechaFin = $scope.filtros.fechafin;

        $scope.filtrosIngles = {};
        $scope.filtrosIngles.fechaini = FechaJson($scope.filtros.fechaini, $scope.filtros.horaini);
        console.log("Fecha json");
        console.log($scope.filtrosIngles.fechaini);
        $scope.filtrosIngles.fechafin = FechaJson($scope.filtros.fechafin, $scope.filtros.horafin);
        // $scope.filtrosIngles.fechaini = FechaFormatoIngles($scope.filtros.fechaini);
        // $scope.filtrosIngles.fechafin = FechaFormatoIngles($scope.filtros.fechafin);
        
        console.log("Filtros formato inglés");
        console.log($scope.filtros);

        $http.post('/ReporteTotalDia/ReporteTotalDiaDetalleCocina', $scope.filtrosIngles).then(function (response) {
            // refresh();
            $scope.cocinaList = response.data;
            for (var i = 0; i < $scope.cocinaList.length; i++) {
                var product = $scope.cocinaList[i];
                $scope.cocinaList[i].subtotal = Math.round(product.subtotal * 100) / 100;
            }
        });

        $http.post('/ReporteTotalDia/ReporteTotalDiaDetalleBar', $scope.filtrosIngles).then(function (response) {
            // refresh();
            $scope.cocinaListBar = response.data;
            for (var i = 0; i < $scope.cocinaListBar.length; i++) {
                var product = $scope.cocinaListBar[i];
                $scope.cocinaListBar[i].subtotal = Math.round(product.subtotal * 100) / 100;
            }
        });
    };

    $scope.agregar = function () {
        $http.post('/ResumenOrdenDetalleAgregar', $scope.Mesa).then(function (res) {
            $window.location.href = res.data.redireccionar;
        });
    };

    $scope.pagarOrden = function () {
        $http.put('/CuentaPagarOrden', $scope.cocinaList).then(function (response) {
            $window.location.href = response.data.redireccionar;
        });
    };

    $scope.eliminar = function (id) {
        $http.put('/ResumenOrdenDetalleEliminar/' + id).then(function (response) {
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
    function subir(file, callback) {
        Upload.upload({
            url: 'http://localhost:4200/upload', //webAPI exposed to upload the file
            data: { file: file } //pass file as data, should be user ng-model
        });

        callback();
    };


    //Exportar a Excel

    $scope.exportData = function () {
        console.log("Ini Html");
        // console.log(document.getElementById('exportable').innerHTML);
        console.log(fechaIni);
        console.log("Fin Html");
        var encabezadoHabitat = "<table><tr><td colspan = '5'><b>Habitat C&R</b></td></tr></table>"
        var encabezadoFecha = "<table><tr><td colspan = '5'><b>Reporte de ventas correspondiente de " + fechaIni + " al " + fechaFin + "</b></td></tr><tr><td></td></tr></table>";
        console.log(encabezadoFecha);
        var blob = new Blob([encabezadoHabitat, encabezadoFecha, document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Ventas-" + FechaHoy() + ".xls");
    };

    var FechaHoy = function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = dd + '/' + mm + '/' + yyyy;
        return today;
    };

    //Exportar a pdf
    $scope.data = [{ "agence": "CTM", "secteur": "Safi", "statutImp": "operationnel" }];

    $scope.export = function () {
        html2canvas(document.getElementById('exportable'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                pdfMake.createPdf(docDefinition).download("test.pdf");
            }
        });
    };

    $scope.exportPDF = function () {
        var doc = new jsPDF('p', 'pt', 'letter');
        
        var specialElementHandlers = {

        };
        var encabezadoHabitat = "<p><H1>Habitat C&R</H1></p>"
        var encabezadoFecha = "<p><H4>Reporte de ventas correspondiente de " + fechaIni + " al " + fechaFin + "</H4></p>";
        console.log("Con get");
        console.log($('#exportable').get(0));
        var tabla =  $('#exportable').get(0);
        var tabla2 = document.getElementById('exportable');
        console.log("Con string");
        console.log(tabla2);
        var tabla3 = "<div>"+encabezadoHabitat + encabezadoFecha+ tabla2.innerHTML +"</div>";
        console.log(tabla3);
        doc.fromHTML( tabla3, 15, 15, {
            'width': 550,
            'margin': 1,
            'pagesplit': true, //This will work for multiple pages
            'elementHandlers': specialElementHandlers,
            

        });
        

        doc.save("Ventas-" + FechaHoy() + ".pdf");
    };


    $scope.formatFecha = function (fechaIn) {
        var fechaTmp = String(fechaIn);
        console.log(fechaTmp);
        var dia = fechaTmp.substring(8, 10);
        var mes = fechaTmp.substring(5, 7);
        var anio = fechaTmp.substring(0, 4);
        var hora = fechaTmp.substring(11, 13);
        var minuto = fechaTmp.substring(14, 16);

        return dia + "-" + mes + "-" + anio + " " + hora + ":" + minuto;
    }

    var FechaFormatoIngles = function (fechaIn) {
        var fechaTmp = String(fechaIn);
        console.log(fechaTmp);
        var dia = fechaTmp.substring(0, 2);
        var mes = fechaTmp.substring(3, 5);
        var anio = fechaTmp.substring(6, 10);

        return mes + "/" + dia + "/" + anio;
    }

    var FechaJson = function(fechaIn, horaIn){
        var fechaTmp = String(fechaIn);
        var horaTmp = String(horaIn);
        var dia = fechaTmp.substring(0, 2);
        var mes = fechaTmp.substring(3, 5) - 1;
        var anio = fechaTmp.substring(6, 10);
        var hora = horaIn.substring(0,2); //el -1 lo coloqué para volverlo int
        var minuto = horaIn.substring(3,5);
        
        console.log(hora);
        console.log(minuto);
        
        return { anio : anio, mes: mes , dia: dia, hora: hora, minuto: minuto};
        
    }
}]);

