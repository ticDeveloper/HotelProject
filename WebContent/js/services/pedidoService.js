'use strict'
app.factory('pedidoService',function($resource){
    var factory=
    {
      calculo: $resource('api/hotel/calculo/:fechaIn/:fechaOut/:cId'),
      estadia: $resource('api/estadia'),
      checkIn: $resource('api/estadia/checkIn'),
      checkOut: $resource('api/estadia/checkOut'),
      updateEstadia: $resource('api/estadia/update'),
      estadias: $resource('api/reservas/:criterio',{criterio:'@criterio'},{
         query: { method:"GET",isArray:true}
      }),
      reservaItem: $resource('api/reservas/:reservaId'),

      habitacionesCuenta: $resource('api/habitacionesCuenta/:cuenta',{cuenta:'@cuenta'},{
        show: { method: "GET", isArray: true }
      })
    };
    return factory;
});
