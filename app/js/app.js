define(
[
    'angular', 
    'angular-route',
], 
function (angular) {
    return angular.module('myapp', ['ngRoute']);
});

String.prototype.evenCap = function(){
    var n = this.toLowerCase().split(''); 
    var out = [];
    n.forEach(function(c,i){
        if (i%2 == 0){
            c = c.toUpperCase();
        }
        out+=c;   
    });
    return out;
};
