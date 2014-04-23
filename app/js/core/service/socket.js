define(['app', 'socketio', 'core/entity/user'], 

function(app) {

    app.provider('socket', function() {

        var prefix = 'socket:', 
            ioSocket;

        this.$get = ['$rootScope', '$timeout', '$user', function($rootScope, $timeout, $user) {

            var socket = {};

            function asyncAngularify(callback) {
                return function () {  
                    var args = arguments;
                    $timeout(function () {
                        callback.apply(ioSocket, args);
                    }, 0);
                };
            };

            function keyMatches(pattern, key) {
                var patternSplit = pattern.split('.'),
                    keySplit = key.split('.'),
                    matches = true;

                if (patternSplit.length !== keySplit.length) {
                    return false;
                }

                $.each(patternSplit, function(i, p) {
                    if (p !== '*' && p !== keySplit[i]) {
                        matches = false;
                    }
                });

                return matches;
            }

            $rootScope.$on('event:auth-loginConfirmed', function(e) {
                console.log('loginConfirmed');
                $timeout(function() {
                    socket.connect();
                }, 0);
            });

            $rootScope.$on('event:auth-loginRequired', function(e) {
                console.log('Socketio will disconnect in 1 sec time');
                $timeout(function() {
                    socket.disconnect(); 
                }, 1000);
                
            });

            $rootScope.$on('logout', function() {
                socket.disconnect();
            });

            socket.subscribe = function(events, scope) {
                var subscription = {},
                    listeners = {};
                
                subscription.on = function(key, cb) {
                    listeners[key] = asyncAngularify(cb);
                };

                if (!ioSocket) {
                    return null;
                }

                if (events instanceof Array === false) {
                    events = [events];
                }
                console.log('events', events);

                events.forEach(function(eventName) {
                    ioSocket.emit('subscribe', eventName);
                    console.log('subscribe', eventName);
                    scope.$on('$destroy', function() {
                        console.log('unsubscribe', eventName);
                        ioSocket.emit('unsubscribe', eventName);
                    });
                });

                var processEvent = function(e) {
                    $.each(listeners, function(keyPattern, cb) {
                        //if (keyMatches(keyPattern, e.key)) {
                            cb(e.data, e.key);
                        //}
                    });
                };

                ioSocket.on('event', processEvent);

                scope.$on('$destroy', function() {
                    ioSocket.removeListener('event', processEvent);                    
                });

                return subscription;
            };

            socket.connect = function(url) {
                var s = ioSocket && ioSocket.socket;
                if (!s || (!s.connected && !s.connecting)) {   
                    ioSocket = io.connect(url, {port:9999});
                    console.log('Socketio connected!', url);
                    $rootScope.$emit('socket:connected');
                }
            };

            socket.disconnect = function() {
                if (ioSocket) {
                    if (ioSocket.socket && ioSocket.socket.transport) {
                        ioSocket.disconnect();
                    }
                    console.log('Socketio disconnected!');
                    io.sockets = [];
                    ioSocket = null;
                    $rootScope.$emit('socket:disconnected');
                }
            };

            return socket;
        }];
    });

});