'use strict'
//controler de modulo de reservas
app.controller('gestionEstadiaOcupanteControl',function($scope,estadiaService,$routeParams,$filter,$modal,$log,$location,fileUpload){
  estadiaService.habitacionesCuenta.show({cuenta:$routeParams.cuentaId},function(response){
      $scope.gridPendientes.data=response;
  });
 //grid configuracion
  $scope.gridPendientes = {
     enableRowSelection: true,
     rowHeight: 35,
     showGridFooter:false,
     columnDefs: [
       { field: 'codigo',  displayName: "Habitacion" },
       { field: 'Clase',  displayName: "Clase" },
       { field: 'fecha_ingreso', displayName: "Fecha Ingreso",enableSorting: false}
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

   $scope.animationsEnabled = true;
   $scope.toggleAnimation = function () {
     $scope.animationsEnabled = !$scope.animationsEnabled;
   };

   $scope.ver = function (size) {
     $scope.gridApi.selection.getSelectedRows();
     var selecteds= $scope.gridApi.selection.getSelectedRows();
     //reservaService.addReserva.withjson({},selecteds);
     $scope.selectedCuenta=selecteds;

     var modalInstance = $modal.open({
       animation: $scope.animationsEnabled,
       templateUrl: 'myModalDetOcupantes.html',
       controller: 'ModalInstanceDetOcuCtrl',
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

   $scope.agregarOcupantes = function (size) {
     $scope.gridApi.selection.getSelectedRows();
     var selecteds= $scope.gridApi.selection.getSelectedRows();
     //reservaService.addReserva.withjson({},selecteds);
     $scope.selectedCuenta=selecteds;

     var modalInstance = $modal.open({
       animation: $scope.animationsEnabled,
       templateUrl: 'ModalInstanceAddOcu.html',
       controller: 'ModalInstanceAddOcuCtrl',
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


   $scope.agregarServicios = function (size) {
     $scope.gridApi.selection.getSelectedRows();
     var selecteds= $scope.gridApi.selection.getSelectedRows();
     //reservaService.addReserva.withjson({},selecteds);
     $scope.selectedCuenta=selecteds;

     var modalInstance = $modal.open({
       animation: $scope.animationsEnabled,
       templateUrl: 'ModalInstanceAddServices.html',
       controller: 'ModalInstanceAddServicesCtrl',
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

});
