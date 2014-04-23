define([
    'app', 
    'core/controller/login',
    'core/service/socket'
], 

function(app) {
  
    return app.config([
        '$routeProvider', '$controllerProvider', '$compileProvider',
        function($routeProvider, $controllerProvider, $compileProvider) {

        $routeProvider.when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginController',
            resolve: {
            //...
            }
        });  

        // Methods for dynamically adding routes, controllers and directives
        // after bootstrap
        app.route = function() {
            $routeProvider.when.apply($routeProvider, arguments);
        };

        app.controller = function() {
            $controllerProvider.register.apply($controllerProvider, arguments);
        };

        app.directive = function() {
            $compileProvider.directive.apply($compileProvider, arguments);
        };

    }])
    .run(['$rootScope', '$location', '$route', '$user', 'socket', 'AuthBaseService', init]);

    function init($rootScope, $location, $route, user){

        var routeLoaded = false;
        $rootScope.$on('event:all_loaded', function() {
            $rootScope.$apply(function() {
                if (!routeLoaded) {
                    $location.path('/login');                
                }
            });
        });
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            routeLoaded = true;
            $.each($rootScope.menuSections, function(i, section) {
                if ($location.path().indexOf(section.route) >= 0) {
                    section.selected = true;
                } else {
                    section.selected = false;
                }
            });
        });

        // Add method to add menu sections
        $rootScope.menuSections = [ ];        

        app.menuSection = function(title, route, order, icon) {
            $rootScope.$apply(function() {
                $rootScope.menuSections.push({
                    title: title, route: route, order: order, icon: icon, 
                    handler: function(){
                        $location.path(route);
                    }
                });
                $rootScope.menuSections.sort(function(a, b) {
                    return a.order-b.order;
                });
                if ($location.$$path === route) {
                    routeLoaded = true;
                    $route.reload();
                }
            });
        };
    }

});
