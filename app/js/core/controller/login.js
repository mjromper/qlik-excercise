define(
[
    'app', 
    'core/service/auth', 
    'core/entity/user',
    'core/directive/fixed_top_navbar'
],
 
function(app) {

    app.controller('LoginController' , ['$scope', '$rootScope', 'AuthBaseService', '$user', '$http', '$location',
            function($scope, $rootScope, authService, user, $http, $location){

        $scope.doLogin = doLogin;
        var loginButton = false;

        $scope.email = 'mjromper@gmail.com';
        $scope.password = '1234';

        function doLogin(){
            
            if (!$scope.email || !$scope.password){
                $rootScope.$emit('notification:show', {msg:'Fields cannot be empty', type:'warning'});
                return;
            }

            loginButton = true;
            var loginPromise = authService.login($scope.email, $scope.password);
            $rootScope.$emit('spinner:show');
            loginPromise.then(_loginSuccess, _loginError);
        }  

        function _loginSuccess(data, status, headers, config){
            $location.path('/section1');
        }
        
        function _loginError(status){
            $rootScope.$emit('spinner:hide');
            if (loginButton){
                if (status === 401){
                    $rootScope.$emit('notification:show', { msg: 'Incorrect username or/and password.', type: 'warning'} );
                }else{
                    $rootScope.$emit('notification:show', { msg: 'Unexpected error, please try later.', type: 'danger'} );
                }
            }   
        }

    }]);
});

