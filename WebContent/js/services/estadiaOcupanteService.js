'use strict'
app.factory('estadiaOcupanteService',function($resource){
    var factory=
    {
      ocupantes: $resource('api/habitacionesOcupantes/:estadia',{estadia:'@estadia'},{
        show: { method: "GET", isArray: true }
      }),
      ocupantesAdd: $resource('api/habitacionesOcupantes',{},{
      }),
      pedidos: $resource('api/pedidos/:estadia',{estadia:'@estadia'},{
        show: {method: "GET", isArray:true}
      }),
      pedidosAdd: $resource('api/pedidos',{},{}),
      productos: $resource('api/productos',{},{
        
      }),
      catProductos: $resource('api/catProductos',{},{})
    };
    return factory;
});
