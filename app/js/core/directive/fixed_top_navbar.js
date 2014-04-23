define(['app','bootstrap'],

function(app, bootstrap){
    
    app.directive('myappNavbar', [ function Modal(){
        var directiveDefinitionObject = {
            restrict: 'A',
            replace: true,
            templateUrl: 'partials/top-navbar.html',
            link: function(scope, element, attr) {
                
            }
        };

        return directiveDefinitionObject;
    }]);
});