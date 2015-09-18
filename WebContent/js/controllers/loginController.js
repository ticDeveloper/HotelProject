'use strict'

app.controller('loginControl',function($scope,loginService){
  $scope.login=function(user){
     loginService.login(user); //llamar al service
  }
});
