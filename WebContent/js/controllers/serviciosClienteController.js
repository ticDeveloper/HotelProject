'use strict'
//controler de modulo de reservas
app.controller('serviciosClienteControl',function($scope,serviciosClienteService,$routeParams,$filter,$modal,$log,$location){
 //grid configuracion
  $scope.gridPendientes = {
     enableRowSelection: true,
     rowHeight: 35,
     showGridFooter:false,
     columnDefs: [
       { field: 'nombre',  displayName: "Nombre" },
       { field: 'descripcion',  displayName: "Producto" },
       { field: 'cantidad',  displayName: "Cantidad" },
       { field: 'precioU',  displayName: "Precio unitario" },
       { field: 'total',  displayName: "Total" },
       { field: 'fecha',  displayName: "Fecha" },
       { field: 'codigo',  displayName: "Habitacion" }
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
  serviciosClienteService.reporteServicios.query({nombre:$routeParams.nombre},function(responsesEstP){
      $scope.gridPendientes.data=responsesEstP;
  });

});
