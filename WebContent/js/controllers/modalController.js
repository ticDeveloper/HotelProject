// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, item,estadiaService) {
  $scope.cuenta=item[0];

  estadiaService.habitacionesCuenta.show({cuenta:$scope.cuenta.id},function(response){
      $scope.habitacionesCuenta=response;
  });

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


app.controller('ModalInstanceCtrlConfirm', function ($scope, $modalInstance, item,estadiaService) {
  $scope.cuenta=item[0];



  $scope.ok = function () {
    estadiaService.estadia.save($scope.cuenta).$promise.then(function(data){
       console.log("actualizacion bien");
   },function(error){
        console.log("actualizacion mal");
   });
    $modalInstance.close();

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


app.controller('ModalInstanceCtrlModif', function ($scope, $modalInstance, item,estadiaService,$filter) {
  $scope.cuenta=item[0];
  $scope.cuenta.fecha_ingreso=new Date($scope.cuenta.fecha_ingreso);
  $scope.cuenta.fecha_salida=new Date($scope.cuenta.fecha_salida);
  $scope.cuenta.exp_date=new Date($scope.cuenta.exp_date);

  $scope.modificar = function () {
    estadiaService.updateEstadia.save($scope.cuenta).$promise.then(function(data){
      console.log("actualizacion bien");
    },function(error){
       console.log("actualizacion mal");
    });
    $modalInstance.close();
  };

  $scope.checkIn=function(){
    estadiaService.checkIn.save($scope.cuenta).$promise.then(function(data){
      console.log("checkIn bien");
    },function(error){
       console.log("checkIn mal");
    });
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.evaluateNights=function(){
    var param2=$scope.cuenta.fecha_ingreso;
    param2=$filter('date')(param2, "yyyy-MM-dd",'+0400');
    var param3=$scope.cuenta.fecha_salida;
    param3=$filter('date')(param3, "yyyy-MM-dd",'+0400');
    estadiaService.calculo.get({fechaIn:param2,fechaOut:param3,cId:$scope.cuenta.id},function(respon){
      $scope.cuenta.noches=respon.dias;
      $scope.cuenta.costo_estadia=respon.costo;
    });
  };
});

app.controller('ModalInstanceCtrlCheckOut', function ($scope, $modalInstance, item,estadiaService,$filter) {
  $scope.cuenta=item[0];
  $scope.cuenta.fecha_salida=new Date($scope.cuenta.fecha_salida);
  $scope.cuenta.exp_date=new Date($scope.cuenta.exp_date);
  $scope.cuenta.total=parseInt($scope.cuenta.costo_estadia) + parseInt($scope.cuenta.costo_serviciosExtra);

  $scope.checkOut = function () {
    estadiaService.checkOut.save($scope.cuenta).$promise.then(function(data){
        
      console.log("checkOut bien");
    },function(error){
      $modalInstance.close();
       console.log("checkOut mal");
    });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.evaluateNights=function(){
    var param2=$scope.cuenta.fecha_ingreso;
    param2=$filter('date')(param2, "yyyy-MM-dd",'+0400');
    var param3=$scope.cuenta.fecha_salida;
    param3=$filter('date')(param3, "yyyy-MM-dd",'+0400');
    estadiaService.calculo.get({fechaIn:param2,fechaOut:param3,cId:$scope.cuenta.id},function(respon){
      $scope.cuenta.noches=respon.dias;
      $scope.cuenta.costo_estadia=respon.costo;
    });
  };

});

app.controller('ModalInstanceDetOcuCtrl', function ($scope, $modalInstance, item,estadiaOcupanteService) {

  $scope.ocupante=item[0];
  estadiaOcupanteService.ocupantes.show({estadia:$scope.ocupante.id_estadia},function(response){
      $scope.habitacionesOcupantes=response;
  });
  estadiaOcupanteService.pedidos.show({estadia:$scope.ocupante.id_estadia},function(response){
      $scope.habitacionesServicios=response;
  });

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

app.controller('ModalInstanceAddOcuCtrl', function ($scope, $modalInstance, item, estadiaOcupanteService,fileUpload) {
  $scope.ocupante=item[0];
  $scope.guardar = function () {
    $scope.ocupantes.idEstadia=$scope.ocupante.id_estadia;
    estadiaOcupanteService.ocupantesAdd.save($scope.ocupantes).$promise.then(function(data){
/*
      var file = $scope.myFile;
      console.log('file is ' );
      console.dir(file);
      var uploadUrl = "/HotelProject/WebContent/api/filesUpload";
      fileUpload.uploadFileToUrl(file, uploadUrl);
*/
      console.log("ocupantes bien");
    },function(error){
       console.log("ocupantes mal");
    });
    $modalInstance.close();
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});


app.controller('ModalInstanceAddServicesCtrl', function ($scope, $modalInstance, item, estadiaOcupanteService,fileUpload) {
  $scope.ocupante=item[0];
  $scope.productos=estadiaOcupanteService.productos.query();
  $scope.catProductos=estadiaOcupanteService.catProductos.query();
  $scope.guardar = function () {
    $scope.data.producto.idHabitacion=$scope.ocupante.id_estadia;
    estadiaOcupanteService.pedidosAdd.save($scope.data.producto).$promise.then(function(data){
/*
      var file = $scope.myFile;
      console.log('file is ' );
      console.dir(file);
      var uploadUrl = "/HotelProject/WebContent/api/filesUpload";
      fileUpload.uploadFileToUrl(file, uploadUrl);
*/
      console.log("pedidos bien");
    },function(error){
       console.log("pedidos mal");
    });
    $modalInstance.close();
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});
