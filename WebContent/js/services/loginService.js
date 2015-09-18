'use strict'
app.factory('loginService',function($http){
  return{
    login:function(user){
      var $promise=$http.post('api/usuario',user);
      $promise.then(function(msg){
         var uid=msg.data;
         if(uid=='success') console.log('success login');
          else console.log('error login');
         });
    }
  }
});
