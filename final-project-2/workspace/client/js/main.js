var EventSearch = require("facebook-events-by-location-core");

var es = new EventSearch({
    "lat": 40.710803,
    "lng": -73.964040,
    "distance": 1000,
    "sort": "venue",
    "version": "v2.8",
    "accessToken": "EAACEdEose0cBAOqv6YeHTgRdU7Lhl2zZBYGkHqaFvBQdA0dnpkPG370oprtTZAz2SA6FNeAgear5I5ZA6omaGUZBFmLyhCIX2jRDmNVIfecpLRNVQPSFZArjofIRFCtQxLCP3xW4hbA1xEv0RLsGrzZAmxDdkweZABONOpvcImItZBtox2WLm18V"
});

es.search().then(function (events) {
    res.send(JSON.stringify(events));
}).catch(function (error) {
    res.send(JSON.stringify(error));
});

