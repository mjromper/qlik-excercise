require.config({
    baseUrl: 'js',
    paths: {
        'domready': '../lib/bower_components/requirejs-domready/domReady',
        'jQuery': '../lib/bower_components/jquery/jquery',
        'angular': '../lib/bower_components/angular/angular',
        'angular-route': '../lib/bower_components/angular-route/angular-route',
        'underscore': '../lib/bower_components/underscore/underscore',
        'bootstrap': '../lib/bower_components/bootstrap/dist/js/bootstrap',
        'socketio': '../lib/bower_components/socket.io-client/dist/socket.io',
        'mapbox': '../lib/bower_components/blnk-map/dist/mapbox',
        'qlik-map':'../lib/bower_components/blnk-map/dist/blnk.map.min',
        'd3':'../lib/bower_components/d3/d3.min',
    },
    shim: {
        'angular': {'exports' : 'angular', deps: ['jQuery']},
        'angular-local-storage': { deps:['angular']},
        'angular-resource': { deps:['angular']},
        'angular-route': { deps: ['angular']},
        'angular-auth-interceptor': { deps:['angular']},
        'jQuery': {'exports' : 'jQuery'},
        'bootstrap': { deps:['jQuery']},
        //BLNK deps
        'qlik-map': { deps:['jQuery', 'mapbox']}
    },
    deps: [
        'init',
        'section1/index',
        'section2/index'
    ],

    callback: function() {      
        angular.element(document).scope().$broadcast('event:all_loaded');
    }
});
