        var marker=[];
        var createMap=function(length, mapEvents){
            
            var pos = new google.maps.LatLng(latitude, longitude);
        
            if(jQuery("#map")){
                jQuery("#map").remove();
            }
            
            jQuery("<div id='map'></div>").insertBefore(jQuery(".marker-tooltip"));
            jQuery("#map").css("border","3px").css("border-style","solid").css("borderColor" , "#58b358");
            
                var map = new google.maps.Map($('#map')[0], {
                    center: pos,
                    zoom: 12,
                    mapTypeId: google.maps.MapTypeId.ROAD
                });
            
            for(var i=0; i < length; i++){
               // console.log("i = " + i);
                      if(i%4==0){
                          latitudeOffset=-i*.00000100;
                          longitudeOffset=i*.00000100;
                      }else if(i%4==1){
                          latitudeOffset=i*.00000100;
                          longitudeOffset=-i*.00000100;   
                      }else if(i%4==2){
                          latitudeOffset=-i*.00000100;
                          longitudeOffset=-i*.00000100;   
                      }else{
                          latitudeOffset=i*.00000100;
                          longitudeOffset=i*.00000100;   
                      }
                      pos = new google.maps.LatLng(mapEvents.events[i]['venue']['location']['latitude'] + latitudeOffset, mapEvents.events[i]['venue']['location']['longitude'] + longitudeOffset);
                      
                      var startDate=mapEvents.events[i]['startTime'];
                      startDate = new Date(startDate);
                      var startDMY=String(startDate).substring(0,15);
                      var startTime=formatAMPM(startDate);
                      startDMY = startDMY.substring(0,10) + ", " + startDMY.substring(10,15);
                      startTime = startDMY + " " + startTime;
                      
                      var endDate=mapEvents.events[i]['endTime'];
                      endDate = new Date(endDate);
                      var endDMY=String(endDate).substring(0,15);
                      var endTime=formatAMPM(endDate);
                      endDMY = endDMY.substring(0,10) + ", " + endDMY.substring(10,15);
                      if (endDMY != startDMY && !(endDate.getYear() < 100)){
                        endTime = "<br>" + endDMY + " " + endTime;
                      }
                      
                      var description=mapEvents.events[i]['description'];
                      
                      try{
                          description= description.substring(0,75) + "...";
                      }catch(error){
                          description=" ";
                      }
                      
                      var readMore=mapEvents.events[i]['id'];
                      readMore= "https://www.facebook.com/events/" + readMore;
                      
                      var dataSelector="data-selector='" + mapEvents.events[i]['venue']['name'] + i + "'";
                      dataSelector=escape(dataSelector);
                      console.log(dataSelector);
                      
                      marker[i] = new google.maps.Marker({
                        position: pos,
                        map: map,
                        tooltipContent : "<strong>Event: </strong><span>" + mapEvents.events[i]['name'] + "</span><br><a href='" + mapEvents.events[i]['coverPicture'] + "' class='event-img' data-lightbox='event-image'><img src='" + mapEvents.events[i]['coverPicture'] + "'/></a><strong>Date & Time: </strong><span> " + startTime + " - " + endTime + "</span><br><strong>Venue: </strong><span class='venue'>" + mapEvents.events[i]['venue']['name'] + "</span><span class='feed-button' data-venue='"+mapEvents.events[i]['venue']['name']+"' data-selector='"+dataSelector+"'><i class='fa fa-twitter' aria-hidden='true'></i>See Tweets</span><br><strong>Location: </strong><span>" + mapEvents.events[i]['venue']['location']['street'] + "</span><br><strong></strong><span>" + mapEvents.events[i]['venue']['location']['city'] + ", " + mapEvents.events[i]['venue']['location']['state'] + " " + mapEvents.events[i]['venue']['location']['zip'] + "</span><br><strong>Description: </strong><span>" + description + "<a target='_blank' href='" + readMore + "'>Read More</a></span>" 
                      });
                      //console.log("Event: " + mapEvents.events[i]['name']);

                            jQuery("#ajaxIndicator").hide();   
                      
                    google.maps.event.addListener(marker[i], 'click', function () {
                        $('.marker-tooltip').html(this.tooltipContent + "<span class='map-close'>x</span>").show();
                    });
        
                    google.maps.event.addListener(marker[i], 'mouseover', function () {
                        $('.marker-tooltip').html(this.tooltipContent + "<span class='map-close'>x</span>").show();
                    });
        
                    $(document).on("click", "span.map-close" , function() {
                        $(this).parent().hide();
                    });
                    
                    
                    $(document).on("click", "[data-selector='" + dataSelector + "']" , function() {
                        console.log(jQuery(this).attr("data-selector"));
                        var venue=jQuery(".venue").text();
                        grabTweets(venue);
                    });
                      
            }
            
                google.maps.event.addListener(map, "dragend", 
                    function() {
                        latitude=map.getCenter().lat();
                        longitude=map.getCenter().lng();
                        //grabEvents();
                        
                        if(jQuery("div#events-button").css("visibility","hidden")){
                            jQuery("div#events-button").css("visibility","visible");
                        }
                        
                        jQuery("input#address").val("");
                        
                        //console.log(map.getCenter().lat() + map.getCenter().lng());
                    }
                );
        
            /*var marker = new google.maps.Marker({
                position: pos,
                map: map
            });
            marker.tooltipContent = 'this content should go inside the tooltip';
            var infoWindow = new google.maps.InfoWindow({
                content: 'This is an info window'
            });
        
            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open(map, marker);
            });
        
            google.maps.event.addListener(marker, 'mouseover', function () {
                infoWindow.open(map, marker);
            });
        
            google.maps.event.addListener(marker, 'mouseout', function () {
                infoWindow.close(map, marker);
            });*/
        }
        

    
    function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}