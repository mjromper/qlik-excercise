define(['app'],

function(app){

    app.factory('Geolocation', ['$rootScope', '$timeout', function($rootScope, $timeout){
            
            var _changeLocation = function (coords) {
                $rootScope.$broadcast("geolocation:change", {
                    coordinates: coords
                });
            };

            var id;
            var lastKnownPosition;
            var options = {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 0
            };

            function start(){
                if (!id && navigator.geolocation) {
                    $timeout(function(){
                        id = navigator.geolocation.watchPosition(success, error, options);
                    }, 1500);
                }else{
                    $timeout(function(){
                        if (lastKnownPosition){
                            success(lastKnownPosition);
                        }
                    }, 1500);    
                }
            }

            function stop(){
                if (id && navigator.geolocation){
                    navigator.geolocation.clearWatch(id);
                }
            }   

            function getCurrentLocation(success, error){
                if (lastKnownPosition){
                    return success(lastKnownPosition);
                }else{
                    var options = {
                      enableHighAccuracy: true,
                      timeout: 5000,
                      maximumAge: 0
                    };
                    navigator.geolocation.getCurrentPosition(function(pos){
                        lastKnownPosition = pos;
                        return success(pos);
                    }, function(){
                        return error();
                    }, options)
                }
            } 

            function success(position){
                console.log('currentPosition', position);
                lastKnownPosition = position;
                $rootScope.$apply(function () {
                    _changeLocation(position.coords);
                });
            }

            function error(error){
                switch(error.code) 
                {
                case error.PERMISSION_DENIED:
                  console.log("User denied the request for Geolocation.");
                  break;
                case error.POSITION_UNAVAILABLE:
                  console.log("Location information is unavailable.");
                  break;
                case error.TIMEOUT:
                  console.log("The request to get user location timed out.");
                  break;
                case error.UNKNOWN_ERROR:
                  console.log("An unknown error occurred.");
                  break;
                }
            }

            return {
                start: start,
                stop: stop,
                getCurrentLocation: getCurrentLocation
            }
            
    }]);
});

