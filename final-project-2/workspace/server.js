var http = require('http');

var latitude;
var longitude;
var meters;

var EventSearch = require("facebook-events-by-location-core");

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//

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
                meters=body.slice(body.lastIndexOf('=') + 1);//not using this because of facebook library bug
                
                
                var facebookEvents;
                
                var es = new EventSearch({
                    "lat": latitude,
                    "lng": longitude,
                    //"distance": meters,
                    "distance": 2000,
                    "sort": "venue",
                    "version": "v2.8",
                    "accessToken": "EAAEk1gT17WcBANBOzAsX99dlnZCQUoSd9RF4U4oz4klUfKofOxhpRsrQLUlrNLzOzfKr9rDYOZBBcdHDDABIJqpXzHD9V72euPSlH8fZCDfsZAKFZBS2xatnGRiOK0hOcHYZAt5kexNRkgR43s8U3Lzd7pecjXyOgZD"
                });
                 es.search().then(function (events) {
                    facebookEvents=JSON.stringify(events);
                    response.writeHead(200, {"Content-Type": "text"});
                    response.writeHead(200, {"Access-Control-Allow-Origin" : "*"});//required for client-side scripts to access data
                    response.write(facebookEvents);
                    response.end();
                 }).catch(function (error) {
                    console.log("There was an error");
                    facebookEvents=JSON.stringify(error);
                });
                
                
                response.on('error', function(err) {
                  console.error(err);
                });
                
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

