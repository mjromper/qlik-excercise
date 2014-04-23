define([
    'app',
    'section2/controller/controller_section2',
    'init'
], function(app) {
    
    app.route('/section2', {
        templateUrl: 'partials/section2/section2.html',
        controller: 'Section2Controller'
    });

    app.menuSection('Section2', '/section2', 1, 'fa-barcode');
});