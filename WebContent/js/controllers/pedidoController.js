'use strict'
//controler de modulo de reservas
app.controller('pedidoControl',function($scope,estadiaService,$routeParams,$filter,$modal,$log,$location){
 //grid configuracion
  $scope.gridPendientes = {
     enableRowSelection: true,
     rowHeight: 35,
     showGridFooter:false,
     columnDefs: [
       { field: 'fecha_ingreso',  displayName: "Fecha Ingreso" },
       { field: 'noches', displayName: "Noches",enableSorting: false},
       { field: 'pago_tarjeta', displayName: "Pago con tarjeta", cellFilter:'filterBoolean'},
       { field: 'servicio_recojo',displayName: "Servcio Aeropuerto",cellFilter:'filterBoolean' },
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
  estadiaService.estadias.query({criterio:'CONFIRMADO'},function(responsesEstP){
      $scope.gridPendientes.data=responsesEstP;
  });

  //grid configuracion
   $scope.gridOcupados = {
      enableRowSelection: true,
      rowHeight: 35,
      showGridFooter:false,
      columnDefs: [
        { field: 'fecha_ingreso',  displayName: "Fecha Ingreso" },
        { field: 'noches', displayName: "Noches",enableSorting: false},
        { field: 'pago_tarjeta', displayName: "Pago con tarjeta",cellFilter:'filterBoolean'},
        { field: 'servicio_recojo',displayName: "Servcio Aeropuerto",cellFilter:'filterBoolean' },
        { field: 'nombre', displayName: "Nombre",enableSorting: false },
        { field: 'telefono', displayName: "Telefono",enableSorting: false },
        { field: 'fecha_reserva', displayName: "Fecha Reserva",enableSorting: false }
      ]
    };

    $scope.gridOcupados.onRegisterApi = function(gridApi2){
     //set gridApi on scope
     $scope.gridApi2 = gridApi2;
     gridApi2.selection.on.rowSelectionChanged($scope,function(row){
       var msg = 'row selected ' + row.isSelected;
       console.log(msg);
     });

     gridApi2.selection.on.rowSelectionChangedBatch($scope,function(rows){
       var msg = 'rows changed ' + rows.length;
       console.log(msg);
     });
   };
  $scope.gridOcupados.multiSelect = false;
  estadiaService.estadias.query({criterio:'OCUPADO'},function(responsesOcu){
      $scope.gridOcupados.data=responsesOcu;
  });

   $scope.animationsEnabled = true;
   $scope.toggleAnimation = function () {
     $scope.animationsEnabled = !$scope.animationsEnabled;
   };

   $scope.open = function (size) {
      $scope.gridApi.selection.getSelectedRows();
      var selecteds= $scope.gridApi.selection.getSelectedRows();
      //reservaService.addReserva.withjson({},selecteds);
      $scope.selectedCuenta=selecteds;

     var modalInstance = $modal.open({
       animation: $scope.animationsEnabled,
       templateUrl: 'myModalDetalles.html',
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

   $scope.modificar = function (size) {
      $scope.gridApi.selection.getSelectedRows();
      var selecteds= $scope.gridApi.selection.getSelectedRows();
      //reservaService.addReserva.withjson({},selecteds);
      $scope.selectedCuenta=selecteds;

     var modalInstance = $modal.open({
       animation: $scope.animationsEnabled,
       templateUrl: 'myModalModif.html',
       controller: 'ModalInstanceCtrlModif',
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

   $scope.checkIn = function (size) {
      $scope.gridApi.selection.getSelectedRows();
      var selecteds= $scope.gridApi.selection.getSelectedRows();
      //reservaService.addReserva.withjson({},selecteds);
      $scope.selectedCuenta=selecteds;

     var modalInstance = $modal.open({
       animation: $scope.animationsEnabled,
       templateUrl: 'myModalCheckIn.html',
       controller: 'ModalInstanceCtrlCheckIn',
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

   $scope.checkOut = function (size) {
      $scope.gridApi2.selection.getSelectedRows();
      var selecteds= $scope.gridApi2.selection.getSelectedRows();
      //reservaService.addReserva.withjson({},selecteds);
      $scope.selectedCuentaOcu=selecteds;

     var modalInstance = $modal.open({
       animation: $scope.animationsEnabled,
       templateUrl: 'myModalCheckOut.html',
       controller: 'ModalInstanceCtrlCheckOut',
       size: size,
       resolve: {
         item: function () {
           return $scope.selectedCuentaOcu;
         }
       }
     });

     modalInstance.result.then(function (selectedItem) {
       $scope.selected = "final popup";
     }, function () {
       $log.info('Modal dismissed at: ' + new Date());
     });
   };


   $scope.open2 = function (size) {
     $scope.gridApi2.selection.getSelectedRows();
     var selecteds= $scope.gridApi2.selection.getSelectedRows();
     //reservaService.addReserva.withjson({},selecteds);
     $scope.selectedCuentaOcu=selecteds;

     var modalInstance = $modal.open({
       animation: $scope.animationsEnabled,
       templateUrl: 'myModalDetalles.html',
       controller: 'ModalInstanceCtrl',
       size: size,
       resolve: {
         item: function () {
           return $scope.selectedCuentaOcu;
         }
       }
     });

     modalInstance.result.then(function (selectedItem) {
       $scope.selected = "final poup";
     }, function () {
       $log.info('Modal dismissed at: ' + new Date());
     });
   };

 $scope.refreshCodeSelected=function(){
   $scope.gridApi2.selection.getSelectedRows();
   var selecteds= $scope.gridApi2.selection.getSelectedRows();
   //reservaService.addReserva.withjson({},selecteds);
   $scope.selectedCuentaOcu=selecteds;
 };
});
