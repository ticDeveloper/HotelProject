/**
 *
 */
var hotelServices=angular.module('hotelServices',['ngResource']);

hotelServices.factory('securityFactory',['$resource',
                function($resource){
				return $resource('http://localhost:1337/mmascota/api/mascotasws',{},{
					query: {method:'GET',isArray:true}
				});
	}]);
