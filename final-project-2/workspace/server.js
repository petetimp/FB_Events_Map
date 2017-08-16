var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var latitude;
var longitude;
var meters;

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//

var router = express();

var server = http.createServer(
    function(request,response){
        var headers = request.headers;
        var method = request.method;
        var url = request.url;
        var body = [];
        request.on('error',
            function(err) {
                console.error(err);
            }
        ).on('data', 
            function(chunk) {
                body.push(chunk);
            }
        ).on('end',
            function() {
                body = Buffer.concat(body).toString();
                latitude=body.slice(body.indexOf('=') + 1, body.indexOf('&'));
                longitude=body.slice(body.indexOf('g') + 2, body.lastIndexOf('&'));
                meters=body.slice(body.lastIndexOf('=') + 1);
                //console.log(latitude);
                //console.log(longitude);
                //console.log(meters);
                
                var EventSearch = require("facebook-events-by-location-core");
                var facebookEvents;
                
                var es = new EventSearch({
                    "lat": latitude,
                    "lng": longitude,
                    //"distance": meters,
                    "distance": 20000,
                    "sort": "venue",
                    "version": "v2.8",
                    "accessToken": "EAACEdEose0cBAOuvRBxN6fVrGaN4kcSZCuVDlcX2bzWjcZA5idOrepB0QxmzHZBhJ8TRKVZAjyhZAGvrrG2NEH3yXZAZBdv8G8YZCDvK0WUS4U7HtkBcjXWueJNWzWCvHMX9ujyB4Pg15os5TEmLVBZCfHrESsortTezf5hqNJtyZBREdzQGP9SEhfTZCxdET958zcZD"
                });
                //console.log("Yes we made it to here!.");
                 es.search().then(function (events) {
                    facebookEvents=JSON.stringify(events);
                    response.writeHead(200, {"Content-Type": "text"});
                    response.writeHead(200, {"Access-Control-Allow-Origin" : "*"});
                    //console.log(facebookEvents);
                    response.write(facebookEvents);
                    response.end();
                 }).catch(function (error) {
                    console.log("There was an error");
                    facebookEvents=JSON.stringify(error);
                });
                
                
                // BEGINNING OF NEW STUFF
                response.on('error', function(err) {
                  console.error(err);
                });

                /*response.statusCode = 200;
                response.setHeader('Content-Type', 'text');
                response.writeHead(200, {"Access-Control-Allow-Origin" : "*"});
                //Note: the 2 lines above could be replaced with this next one:
                //response.writeHead(200, {'Content-Type': 'application/json'})

                var responseBody = {
                    headers: headers,
                    method: method,
                    url: url,
                    body: body
                };
                response.write(JSON.stringify(responseBody));
                response.end();*/
                // Note: the 2 lines above could be replaced with this next one:
                // response.end(JSON.stringify(responseBody))

                // END OF NEW STUFF
                //response.writeHead(200, {"Content-Type": "text"});
                //response.writeHead(200, {"Access-Control-Allow-Origin" : "*"});
                //console.log(facebookEvents);
                //response.write(facebookEvents);
                //response.end();
                
            }
        );
        
        
    }
);

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", 
    function(){
        var addr = server.address();
        console.log("Events server listening at", addr.address + ":" + addr.port);
    }
);

