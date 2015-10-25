'use strict'
app.factory('estadiaOcupanteService',function($resource){
    var factory=
    {
      ocupantes: $resource('api/habitacionesOcupantes/:estadia',{estadia:'@estadia'},{
        show: { method: "GET", isArray: true }
      }),
      ocupantesAdd: $resource('api/habitacionesOcupantes',{},{     
      })
    };
    return factory;
});
