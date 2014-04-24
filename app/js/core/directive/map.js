define(['app','qlik-map', 'init'],

function(app){
    
    app.directive('qlikMap', ['$timeout', '$rootScope',
        function Map($timeout, $rootScope) {
        return {
            restrict: 'A',
            scope: { 
                items: '=',
                colors: '='
            },
            link: function(scope, element, attrs) {

                var map;

                map = Blnk.map(element, {
                    markerFunction: function(item) {
                        if (item.lat &&
                            item.lon &&
                            item.name) { 
                            return {
                                latitude: item.lat,
                                longitude: item.lon,
                                title: item.name,
                                cssClass: 'fa-map-marker',
                                country: item.country,
                                color: scope.colors[item.continent_code],

                            }
                        }
                    },
                    tooltipTpl: '<div>{{marker.title}}</div>'+
                    '<div style="color: {{marker.color}}">{{marker.country}}</div>'+
                    '<div class="blnk-map-tooltip-arrow-down"></div>'
                }); 

                scope.$watch('items', function(values) {
                    if (values){   
                        map.setData(values || []);
                        $timeout(function(){   
                            var zoom;
                            if (values.length === 1){ 
                                zoom = 12 
                            };   
                            map.centerOnMarkers(zoom); 
                        }, 500);
                        
                    }  
                }, true);

            }
        };    
    } ]);
});

