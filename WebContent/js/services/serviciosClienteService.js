'use strict'
app.factory('serviciosClienteService',function($resource){
    var factory=
    {

      reporteServicios: $resource('api/serviciosCli/:nombre',{nombre:'@nombre'},{
         query: { method:"GET",isArray:true}
      })
    };
    return factory;
});
