'use strict'
//controler de modulo de reservas
app.controller('reservaControl',function($scope,reservaService,$routeParams,$filter,$window){
  $scope.gridOptions = {
     enableRowSelection: true,
     rowHeight: 35,
     showGridFooter:true,
     columnDefs: [
       { field: 'codigo', displayName: "Code" },
       { field: 'Clase', displayName: "Class" },
       { field: 'tipo_banio', displayName: "BathRoom", enableSorting: false },
       { field: 'frigobar', displayName: "Snack",cellFilter:'filterBoolean'},
       { field: 'tarifa', enableSorting: false }
     ]
   };
   $scope.gridOptions.showGridFooter=false;
   $scope.gridOptions.onRegisterApi = function(gridApi){
    //set gridApi on scope
    $scope.gridApi = gridApi;
    gridApi.selection.on.rowSelectionChanged($scope,function(row){
      var msg = 'row selected ' + row.isSelected;
      console.log(msg);
    });

    gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
      var msg = 'rows changed ' + rows.length;
      console.log(msg);
    });
  };
   $scope.gridOptions.multiSelect = true;

  $scope.reservar=function(customer){
      $scope.gridApi.selection.getSelectedRows();
      var selecteds= $scope.gridApi.selection.getSelectedRows();
       //reservaService.addReserva.withjson({},selecteds);
       $scope.customer.selectedHabs=selecteds;

       reservaService.reservas.save(customer).$promise.then(function(data){
         $mesg="Reserva realizada exitosamente, en breve nos comunicaremos con usted para verificar la reserva."
         $location.path( "/messages/".$mesg );
      },function(error){
           $mesg="La reserva no fue realizada, asegurese de llenar correctamente los campos."
           $location.path( "/message/".$mesg );
      });
  };
  //function to filter data
  $scope.filtrar=function(filtro){
     var param1=filtro.number;
     var param2=filtro.dateIn;
     param2=$filter('date')(param2, "yyyy-MM-dd",'+0400');
     var param3=filtro.dateOut;
     param3=$filter('date')(param3, "yyyy-MM-dd",'+0400');
      reservaService.habitacionesDisp.show({number:param1,dateIn:param2,dateOut:param3},function(responses){
        $scope.listaHabis=responses;
        $scope.gridOptions.data=responses;
      });
  };
  $scope.next=function(){
    console.log($scope.checkedSearch);
  };

  $scope.ShowAlert = function () {
                if (typeof ($scope.Name) == "undefined" || $scope.Name == "") {
                    $window.alert("Please enter your name!");
                    return;
                }
                $window.alert("Hello " + $scope.Name);
            }


            $scope.evaluateNights=function(){
              var param2=$scope.customer.datea;
              param2=$filter('date')(param2, "yyyy-MM-dd",'+0400');
              var param3=$scope.customer.dateOut;
              param3=$filter('date')(param3, "yyyy-MM-dd",'+0400');
              $scope.gridApi.selection.getSelectedRows();
              var selecteds= $scope.gridApi.selection.getSelectedRows();
              var totalN=0;
              reservaService.calculo.get({fechaIn:param2,fechaOut:param3},function(respon){
                totalN=respon;
              });
              $scope.customer.nights=totalN;
            };
});
