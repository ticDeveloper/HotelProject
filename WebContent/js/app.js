'use strict'
var app= angular.module('hotelApp', ['ngRoute','ngResource','ui.grid','ui.grid.selection','ngAnimate', 'ui.bootstrap']);

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
			when('/estadia/gestion',{
				  templateUrl: 'partials/gestionEstadia.html',
				  controller: 'gestionEstadiaControl'
			}).
			when('/messages/:msg',{
					templateUrl: 'partials/message.html',
					controller: 'messageControl'
			}).
			otherwise({
				redirectTo: '/'
			});
}]);
