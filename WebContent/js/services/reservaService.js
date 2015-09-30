'use strict'
app.factory('reservaService',function($resource){
    var factory=
    {
      addReserva: $resource('api/reservas',null,{
         withjson: { method: "PUT"}
      }),
      reservas: $resource('api/reservas',{},{
         query: { method: "GET", isArray: true }
      }),
      habitacionesTipo: $resource('api/habitacionesTipo',{},{
         query: { method: "GET", isArray: true }
      }),
      habitacionesDisp: $resource('api/habitaciones/:number/:dateIn/:dateOut',{},{
         show: { method: "GET", isArray: true }
      }),
      habitacionesDispMacro: $resource('api/habitacionesMacro/:number/:dateIn/:dateOut',{},{
         show: { method: "GET", isArray: true }
      }),
      calculo:$resource('api/noches/:fechaIn/:fechaOut')

    };
    return factory;
});
