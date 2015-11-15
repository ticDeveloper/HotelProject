'use strict'

app.controller('loginControl',function($scope,loginService,$location){
  $scope.login=function(user){
     loginService.login.loginUser({usuario:user.name,clave:user.clave},function(data){
           var user= data;
           if(user.id>0) $location.path('/estadia');
           else $location.path('/login');
     });
  };
});
