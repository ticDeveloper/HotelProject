'use strict'
//controler de modulo de reservas
app.controller('listaHabitacionesControl',function($scope,listaHabitacionesService,$routeParams,$filter,$modal,$log,$location){

  $scope.gridPendientes = {
     enableRowSelection: true,
     rowHeight: 35,
     showGridFooter:false,
     columnDefs: [
       { field: 'codigo',  displayName: "Numero" },
       { field: 'tipo', displayName: "Tipo",enableSorting: false},
       { field: 'tipo_banio', displayName: "Tipo Baño"},
       { field: 'frigobar', displayName: "Frigobar", cellFilter:'filterBoolean'},
       { field: 'sofa_cama', displayName: "Sofa cama", cellFilter:'filterBoolean'}
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
  listaHabitacionesService.habitacionesOcu.query(function(responsesEstP){
      $scope.gridOcupados.data=responsesEstP;
  });

  $scope.gridOcupados = {
     enableRowSelection: true,
     rowHeight: 35,
     showGridFooter:false,
     columnDefs: [
       { field: 'codigo',  displayName: "Numero" },
       { field: 'tipo', displayName: "Tipo",enableSorting: false},
       { field: 'tipo_banio', displayName: "Tipo Baño"},
       { field: 'frigobar', displayName: "Frigobar", cellFilter:'filterBoolean'},
       { field: 'sofa_cama', displayName: "Sofa cama", cellFilter:'filterBoolean'}
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
 listaHabitacionesService.habitacionesDisp.query(function(responsesOcu){
     $scope.gridPendientes.data=responsesOcu;
 });

});
