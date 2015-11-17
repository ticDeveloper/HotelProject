'use strict'
var app= angular.module('hotelApp', ['ngRoute','ngResource','ui.grid','ui.grid.selection','ngAnimate', 'ui.bootstrap','flow']);

app.config(['$routeProvider',
	function($routeProvider){
		$routeProvider.
			when('/',{
				templateUrl: 'partials/reserva.html',
				controller: 'reservaControl'
			}).
			when('/tariff',{
				templateUrl: 'partials/tarifa.html'
			}).
			when('/services',{
				templateUrl: 'partials/services.html'
			}).
			when('/food',{
				templateUrl: 'partials/food.html'
			}).
			when('/contact',{
				templateUrl: 'partials/contact.html'
			}).
			when('/login',{
					templateUrl: 'partials/login.html',
					controller:'loginControl'
			}).
			when('/reserva',{
					templateUrl: 'partials/reserva.html',
					controller:'reservaControl'
			}).
			when('/estadia',{
				  templateUrl: 'partials/estadia.html',
				  controller: 'estadiaControl'
			}).
			when('/pedidos',{
				  templateUrl: 'partials/pedidos.html',
				  controller: 'pedidoControl'
			}).
			when('/habitacionesLista',{
				  templateUrl: 'partials/listaHabitaciones.html',
				  controller: 'listaHabitacionesControl'
			}).
			when('/serviciosCliente',{
					templateUrl: 'partials/filtroReporteServicios.html'
			}).
			when('/serviciosCliente/:nombre',{
					templateUrl: 'partials/reporteServicios.html',
					controller : 'serviciosClienteControl'
			}).
			when('/reservaCliente',{
				  templateUrl: 'partials/reservaCliente.html',
				  controller: 'reservacliControl'
			}).
			when('/estadia/gestion',{
				  templateUrl: 'partials/gestionEstadia.html',
				  controller: 'gestionEstadiaControl'
			}).
			when('/estadia/gestionOcupante/:cuentaId',{
					templateUrl: 'partials/gestionEstadiaOcupante.html',
					controller: 'gestionEstadiaOcupanteControl'
			}).
			when('/messages/:msg',{
					templateUrl: 'partials/message.html',
					controller: 'messageControl'
			}).
			when('/messagesCli/:msg',{
					templateUrl: 'partials/messageCli.html',
					controller: 'messageControl'
			}).
			otherwise({
				redirectTo: '/'
			});
}]);
