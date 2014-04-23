define(
[
    'angular' , 
    'angular-resource',
    'angular-route',
    'angular-auth-interceptor'
], 
function (angular) {
    return angular.module('myapp', ['ngResource', 'ngRoute',
        'http-auth-interceptor']);
});
