define([
    'app',
    'section1/controller/controller_section1',
    'init'
], function(app) {
    
    app.route('/section1', {
        templateUrl: 'partials/section1/section1.html',
        controller: 'Section1Controller'
    });

    app.menuSection('Section1', '/section1', 2, 'fa-barcode');
});