'use strict'
app.factory('listaHabitacionesService',function($resource){
    var factory=
    {
      habitacionesOcu: $resource('api/habitacionesOcu'),
      habitacionesDisp: $resource('api/habitacionesDisp')
    };
    return factory;
});
