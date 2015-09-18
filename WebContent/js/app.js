'use strict'
var app= angular.module('hotelApp', ['ngRoute']);

app.config(['$routeProvider',
	function($routeProvider){
		$routeProvider.
			when('/login',{
					templateUrl: 'partials/login.html',
					controller:'loginControl'
			}).
			otherwise({
				redirectTo: '/login'
			});
}]);
