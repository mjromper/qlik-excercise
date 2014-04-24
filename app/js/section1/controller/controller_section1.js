define([
    'app', 
    'core/service/socket',
    'core/directive/map',
    'core/directive/city_card',
    'core/directive/donut_chart',
    'core/directive/barchart',
    'core/service/geolocation',
    'init'
],

function(app){

    app.controller('Section1Controller', ['$rootScope', '$scope', 'socket', 'Geolocation', '$timeout',
        function($rootScope, $scope, socket, Geolocation, $timeout){

    	var subs;
            
        $scope.status = false;
    	$scope.journey = [];
        $scope.buttonTravel = 'START JOURNEY';

        $scope.colors = { 'EU': '#01A4A4', 'AF': '#61AE24', 'OC': '#F18D05', 'SA': '#B10DC9', 'NA': '#E54028', 'AN': '#113F8C', 'AS': '#D0D102'};
        $scope.pictures = [
            {name: 'EU', title: 'Europe', value: 1 },
            {name: 'AF', title: 'Africa', value: 0 },
            {name: 'OC', title: 'Oceania', value: 0 },
            {name: 'SA', title: 'S. America', value: 0 },
            {name: 'NA', title: 'N. America', value: 0 },
            {name: 'AN', title: 'Antartica', value: 0 },
            {name: 'AS', title: 'Asia', value: 0 }
        ];
        

        Geolocation.getCurrentLocation(function(position){
            console.log('current', position);
            var city = {
                country_code: 'UK',
                continent_code: 'EU',
                country: 'United Kingdom'.evenCap(),
                name: 'London'.evenCap(),
                continent: 'Europe',
                lat: position.coords.latitude,
                lon: position.coords.longitude
            }

            
            $timeout(function(){
                $scope.cityData = { city: city };
                $scope.city = [city];
                $scope.journey.push({name: city.name, color: 'white', code: city.continent_code });
            },100)
            

        }, function(){
            console.log('error getting current');
        });

        $scope.$on('bar-clicked', function(e, item){
            var code = item.name;
            $timeout(function(){
                $scope.journey = _.map($scope.journey, function(j){
                    if (j.code === code){
                        j.color = $scope.colors[code];
                    }else{
                        j.color = 'white';
                    }
                    return j;
                });
            });
        });


    	$scope.buttonClick = function(){
            if ($scope.status === false){
                socketSuscription();
                $scope.status = true;
                $scope.buttonTravel = 'STOP HERE';
            }else if ($scope.status === true){
                socketUnsubscription();
                $scope.status = false;
                $scope.buttonTravel = 'CONTINUE TRAVELING';
            }
        }

        function socketSuscription(){
        	if (!subs){
        		subs = socket.subscribe('damedatos', $scope);
        	}     	
        	if (!subs) return;
        	subs.on('damedatos', function(data) {
       			
                data.city.name = data.city.name.evenCap();
                data.city.country = data.city.country.evenCap();

       			$scope.city = [data.city];
       			$scope.cityData = data;
       			$scope.journey.push({name: data.city.name, color: 'white', code: data.city.continent_code});
                var total = data.total;
                var cc = data.city.continent_code;
                
                _.each($scope.pictures, function(picture){
                    if (picture.name == cc){
                        picture.value++;
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
