'use strict'
//controler de modulo de reservas
app.controller('messageControl',function($scope,estadiaService,$routeParams,$filter,$modal,$log,$location){
      $scope.message=$routeParams.msg;
});
