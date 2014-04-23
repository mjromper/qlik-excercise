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
            {name: 'EU', population: 0 },
            {name: 'AF', population: 0 },
            {name: 'OC', population: 0 },
            {name: 'SA', population: 0 },
            {name: 'NA', population: 0 },
            {name: 'AN', population: 0 },
            {name: 'AS', population: 0 }
        ];
        

        Geolocation.getCurrentLocation(function(position){
            console.log('current', position);
            var city = {
                country_code: 'UK',
                country: 'United Kingdom',
                name: 'London',
                continent: 'Europe',
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
                var total = data.total;
                var cc = data.city.continent_code;
                
                _.each($scope.pictures, function(picture){
                    if (picture.name == cc){
                        picture.population += total;
                    }
                });
        	});
        }  	

        function socketUnsubscription(){
            socket.unsubscribe('damedatos', $scope);
            subs = null;
        }

    }]);
});
