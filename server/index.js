var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: "c148989ce0e9b05b0bbb4e6e2cfdad33",
      secret: "eb9b8022d5b85123",
      user_id: "123758123%40N02",
      access_token: "72157644222564335-d281d71c48e239a3",
      access_token_secret: "ff41576ae9303f39"
    };

var _ = require('underscore-node');

var cities = require('./w_cities.json'); 
var codes = require('./country_codes.json'); 
var continents = require('./continents.json');


var port = 9999,
    http = require('http'),
    socketio = require('socket.io'),
    httpServer = http.createServer(),
    idTask = null;

console.log('Starting QLIK Pusher on port ' + port);
httpServer.listen(port);
var io = socketio.listen(httpServer, { log: false });

Flickr.authenticate(flickrOptions, function(error, flickr) {   
    io.sockets.on('connection', function(socket){
        handlerSocket(socket, flickr);
    });
}); 

function handlerSocket(socket, flickr) {
      socket.on('subscribe', function (data) {
        if (!idTask){
            idTask = setInterval(function(){
                getPictures(flickr, socket);
            }, 10000);
        }
      });

      socket.on('unsubscribe', function (data) {
        clearInterval(idTask);
        idTask = null;
      });     
};

function getPictures(flickr, socket){
    
    var city = cities[getRandomInt(0, cities.length-1)];
    console.log(city);
    var countryName = _.find(codes, function(code){
      return code['alpha-2'] == city.country_code;
    });
    city.country = countryName.name;
    var continent = _.find(continents, function(c){
      return c.country_code == countryName['alpha-2'];
    });
    city.continent_code = continent.continent_code;
    city.continent_name = continent.continent_name;
    var text = city.name;

    flickr.photos.search({
        text: text
    }, function(err, result) {
        if(err) { throw new Error(err); }
        
        var images = {key: text, total: result.photos.total, pics: [], city: city };
        result.photos.photo.forEach(function(p){    
            if (p.ispublic == 1){
                images.pics.push({
                    url: 'http://farm'+p.farm+'.staticflickr.com/'+p.server+'/'+p.id+'_'+p.secret+'_m.jpg',
                    title: p.title, 
                })  
            }
        });
        socket.emit('event', { data: images });
    });
};

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};






