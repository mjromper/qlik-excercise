define(['app','qlik-map', 'init'],

function(app){
    
    app.directive('qlikCityCard', ['$timeout', '$rootScope',
        function Map($timeout, $rootScope) {
        return {
            restrict: 'A',
            scope: { 
                item: '='
            },
            templateUrl: 'partials/city_card.html',
            link: function(scope, element, attrs) {
                scope.$watch('item', function(item) {
                   console.log('item', item);
                });

            }
        };    
    } ]);
});

