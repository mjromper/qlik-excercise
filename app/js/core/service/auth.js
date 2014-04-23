define([
    'app',
    'underscore'
],

function(app){
    
    app.factory('AuthBaseService', ['$http', '$rootScope', '$location',
        '$user', 'authService', '$q', '$cacheFactory', '$timeout',
            function($http, $rootScope, $location, user,
                authService, $q, $cacheFactory, $timeout){           
        //All avialable routes
        var routes = [
            { path:'/login', auth: false },
            { path:'/section1', auth: true }, 
            { path:'/section2', auth: true },
        ];

        var routeRequiresAuth = function (route) {
            return _.find(routes, function (r){
                return (r.path.indexOf(route) === 0) && r.auth;
            });
        };

        $rootScope.$on('$routeChangeStart', function (event, next, current) {  
            var url = $location.url();
            var isRoute = _.find(routes, function(r){
                return r.path.indexOf(url) === 0;
            });
            if (!isRoute){
                $location.path('/forbidden');
                return;
            }    
            if (routeRequiresAuth(url) && !user.isLogged){
                // if route requires auth and user is not logged in
                getUserData();
            }else if (url.indexOf('/login') === 0 && user.isLogged) {
                $location.path('/section1');
            }
        });


        var getUserData = function() {
            //Mock user: 
            var data = {
                'username': 'mjromero',
                'first_name': 'Manuel',
                'last_name': 'Romero',
                'email': 'mjromper@gmail.com'
            }
            user.setUserData(data);  
            authService.loginConfirmed(data);
        };
        
        $rootScope.logout = function(){
            user.clearUserData();
            $rootScope.$broadcast('event:auth-loginRequired', {origin:'logout_button'});
        }; 

        $rootScope.$on('event:auth-loginConfirmed', function() {
            $rootScope.isLogged = true;
        });

        $rootScope.$on('event:auth-loginRequired', function(e, item) {
            $cacheFactory.get('$http').removeAll();
            loggedOut();
        });

        var loggedOut = function(){
            $rootScope.isLogged = false;
            user.clearUserData();
            $location.path('/login');
        };

        var login = function(email, password) {
            //Login simulation
            var deferred = $q.defer();

            $timeout(function(){
                deferred.resolve();
            },3000);
            
            return deferred.promise;
        };


        return {
            'login': login,
            'getUserData': getUserData
        };
    }]);
});
