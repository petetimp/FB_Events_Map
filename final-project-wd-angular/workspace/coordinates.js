function getLatitudeLongitude(address) {
    // If address is not supplied, use default value 'Ferrol, Galicia, Spain'
    address = address || 'Ferrol, Galicia, Spain';
    // Initialize the Geocoder
    var geocoder = new google.maps.Geocoder();
    if (geocoder) {
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                result=results[0];
                latitude=result.geometry.location.lat();
                longitude=result.geometry.location.lng();
            }
        });
    }
}
