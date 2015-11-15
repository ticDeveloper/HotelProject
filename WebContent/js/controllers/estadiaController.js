'use strict'
//controler de modulo de reservas
app.controller('estadiaControl',function($scope,estadiaService,$routeParams,$filter,$modal,$log,$location){
 //grid configuracion
  $scope.gridPendientes = {
     enableRowSelection: true,
     rowHeight: 35,
     showGridFooter:false,
     columnDefs: [
       { field: 'fecha_ingreso',  displayName: "Fecha Ingreso" },
       { field: 'fecha_salida',  displayName: "Fecha Salida" },
       { field: 'noches', displayName: "Noches",enableSorting: false},
       { field: 'pago_tarjeta', displayName: "Pago con tarjeta",cellFilter:'filterBoolean'},
       { field: 'servicio_recojo',displayName: "Servcio Aeropuerto", cellFilter:'filterBoolean' },
       { field: 'nombre', displayName: "Nombre",enableSorting: false },
       { field: 'telefono', displayName: "Telefono",enableSorting: false },
       { field: 'fecha_reserva', displayName: "Fecha Reserva",enableSorting: false }
     ]
   };

   $scope.gridPendientes.onRegisterApi = function(gridApi){
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
   $scope.gridPendientes.multiSelect = false;

/*
  estadiaService.reservaItem.get({reservaId:$routeParams.reservaID},function(response){
      $scope.item=response;
      $scope.idReserva=$scope.item.id;
  });*/
  estadiaService.estadias.query({criterio:'RESERVA'},function(responsesEstP){
      $scope.gridPendientes.data=responsesEstP;
  });

  //definimos la funcion para filtrar las habitaciones
  /* $scope.buscarHab=function(filtro){
      var param1=filtro.tipoHabitacion;
      var param2=filtro.numero_personas;
      var param3=filtro.bano;
      estadiaService.habitaciones.show({tipo:param1,nro:param2,comp:param3},function(responses){
          $scope.habitacionesListaa=responses;
          $scope.habitacion="NO ASIGNADA";
   });
 }; */

 // $scope.habitacion="NO ASIGNADA";
//funcion para desmarcar los checkboxes de habitacion y seleccionar un unico checkbox
  /*$scope.change = function(hab) {
       angular.forEach($scope.habitacionesListaa, function(item) {
           item.checked = false;
       });
       hab.checked = true;
       $scope.habitacion=hab.codigo;
   }; */

   $scope.animationsEnabled = true;

   $scope.open = function (size) {
      $scope.gridApi.selection.getSelectedRows();
      var selecteds= $scope.gridApi.selection.getSelectedRows();
      //reservaService.addReserva.withjson({},selecteds);
      $scope.selectedCuenta=selecteds;

     var modalInstance = $modal.open({
       animation: $scope.animationsEnabled,
       templateUrl: 'myModalContent.html',
       controller: 'ModalInstanceCtrl',
       size: size,
       resolve: {
         item: function () {
           return $scope.selectedCuenta;
         }
       }
     });

     modalInstance.result.then(function (selectedItem) {
       $scope.selected = "final poup";
     }, function () {
       $log.info('Modal dismissed at: ' + new Date());
     });
   };

   $scope.toggleAnimation = function () {
     $scope.animationsEnabled = !$scope.animationsEnabled;
   };



   $scope.confirm = function (size) {
      $scope.gridApi.selection.getSelectedRows();
      var selecteds= $scope.gridApi.selection.getSelectedRows();
      //reservaService.addReserva.withjson({},selecteds);
      $scope.selectedCuenta=selecteds;

     var modalInstance = $modal.open({
       animation: $scope.animationsEnabled,
       templateUrl: 'myModalConfirm.html',
       controller: 'ModalInstanceCtrlConfirm',
       size: size,
       resolve: {
         item: function () {
           return $scope.selectedCuenta;
         }
       }
     });
     modalInstance.result.then(function (selectedItem) {
        $location.path('/estadia');
     }, function () {
       $log.info('Modal dismissed at: ' + new Date());
     });
   };
});
