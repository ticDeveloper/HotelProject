'use strict'
app.factory('loginService',function($resource){
  var factory={
    login: $resource('api/usuario/:usuario/:clave',{},{
        loginUser: {method:'GET',isArray:false}
    })
  };
  return factory;
});
