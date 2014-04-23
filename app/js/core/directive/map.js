define(['app','qlik-map', 'init'],

function(app){
    
    app.directive('qlikMap', ['$timeout', '$rootScope',
        function Map($timeout, $rootScope) {
        return {
            restrict: 'A',
            scope: { 
                items: '=',
                options: '@', 
            },
            link: function(scope, element, attrs) {
                var options = attrs.option,
                    map,
                    markers;

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
                                color: '#a1ca80',

                            }
                        }
                    },
                    tooltipTpl: '<div>{{marker.title}}</div>'+
                    '<div style="color: {{marker.color}}">{{marker.country}}</div>'+
                    '<div class="blnk-map-tooltip-arrow-down"></div>'
                }); 

                element.on('markerclick', function(e, marker, asset) {
                    map.select(marker);

                    //If function defined for marker click
                    if (scope.onMarkerClick){
                        scope.$apply(function() {
                            scope.onMarkerClick(e, marker, asset);
                        });
                    }
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

