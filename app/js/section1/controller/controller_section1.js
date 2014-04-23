define([
    'app', 
    'core/service/socket',
    'core/directive/map',
    'core/directive/city_card',
    'init'
],

function(app){

    app.controller('Section1Controller', ['$rootScope', '$scope', 'socket', function($rootScope, $scope, socket){

    	var subs = socket.subscribe('damedatos', $scope);
    	socketSuscription();

    	$scope.journey = [];


    	$rootScope.$on('socket:connected', function(){
    		console.log('socket:connected');
            socketSuscription();
        });

        function socketSuscription(){
        	if (!subs){
        		subs = socket.subscribe('damedatos', $scope);
        	}     	
        	if (!subs) return;
        	subs.on('damedatos', function(data, key) {
       			console.log('data', data);
       			$scope.city = [data.city];
       			$scope.cityData = data;
       			$scope.journey.push({name: data.key});

        	});
        }  	

    }]);
});
