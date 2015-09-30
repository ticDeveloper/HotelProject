'use strict'
//controler de modulo de reservas
app.controller('presentacionControl',function($scope,reservaService,$filter){
  $scope.filtrar=function(filtro){
     var param1=filtro.number;
     var param2=filtro.dateIn;
     param2=$filter('date')(param2, "yyyy-MM-dd",'+0400');
     var param3=filtro.dateOut;
     param3=$filter('date')(param3, "yyyy-MM-dd",'+0400');
      reservaService.habitacionesDispMacro.show({number:param1,dateIn:param2,dateOut:param3},function(responses){
        $scope.listaHab=responses;
        $scope.noRows="true"; // fake to don't show grid at load page
      });
  };



});
