define([
    'app', 
    'core/service/socket',
    'core/directive/map',
    'core/directive/city_card',
    'core/directive/donut_chart',
    'core/service/geolocation',
    'init'
],

function(app){

    app.controller('Section1Controller', ['$rootScope', '$scope', 'socket', 'Geolocation', '$timeout',
        function($rootScope, $scope, socket, Geolocation, $timeout){

    	var subs;
            
        $scope.status = false;
    	$scope.journey = [];
        $scope.buttonTravel = 'CONTINUE JOURNEY';
        $scope.pictures = [
            {name: '<5', population:2704659 },
            {name: '14-17', population:2159981 },
            {name: '18-24', population:3853788 },
            {name: '5-13', population:4499890 },
            {name: '25-44', population:14106543 },
            {name: '45-64', population:8819342 },
            {name: '≥65', population:612463 }
        ];
        

        Geolocation.getCurrentLocation(function(position){
            console.log('current', position);
            var city = {
                country_code: 'UK',
                country: 'United Kingdom',
                name: 'London',
                continent_code: 'Europe',
                lat: position.coords.latitude,
                lon: position.coords.longitude
            }
            
            $timeout(function(){
                $scope.city = [city];
                $scope.journey.push({name: city.name});
            },100)
            

        }, function(){
            console.log('error getting current');
        });


    	$scope.buttonClick = function(){
            if ($scope.status === false){
                socketSuscription();
                $scope.status = true;
                $scope.buttonTravel = 'STOP HERE';
            }else if ($scope.status === true){
                socketUnsubscription();
                $scope.status = false;
                $scope.buttonTravel = 'CONTINUE JOURNEY';
            }
        }

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

        function socketUnsubscription(){
            socket.unsubscribe('damedatos', $scope);
            subs = null;
        }

    }]);
});
