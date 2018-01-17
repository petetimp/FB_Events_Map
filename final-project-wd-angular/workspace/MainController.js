app.controller('MainController', 
  ['$scope', '$http',
      function($scope, $http) { 
          $scope.title = 'Facebook Events Map';
          $scope.twitterTitle = 'Tweets';
          $scope.address;
          $scope.latitude;
          $scope.longitude;
          $scope.markers = [];
          $scope.facebookEvents;
          $scope.twitterResponse = {};
          
          /**
        	 * Makes call to server script that returns facebook events based on latitude, longitude, and meters
        	 **/
          $scope.grabEvents =
            function(){
              $("#ajaxIndicator").show();//Show the loading indicator
              
              //Make a server request to our node.js script with latitude, longitude, and meters returned from Geolocation API
              $.ajax({
                  type: "POST",
                  url: 'https://final-project-2-petetimp.c9users.io/server.js',
                  cache: false,
                  data: {lat: $scope.latitude,long: $scope.longitude, meters: 20000}
                }).done(
                  function(data){
                    $scope.facebookEvents = jQuery.parseJSON(data);//parse returned data into JSON
                    $scope.createMap($scope.facebookEvents.events.length,$scope.facebookEvents);//Create Map with returned JSON
                  }
                );  
            },
          
          /**
        	 * Validates user input address. If valid, the getLatitudeLongitude function is called to get latitude and longitude to send to server in grabEvents function.
        	 * If invalid, error message is displayed.
        	 * @param event {{ object }} the input object where validation is occurring
        	 **/  
          $scope.validateAddress =
            function(event){
              var elem = event.target;
              var regex = /^[A-Za-z ]+,[ ]?[A-Za-z]{2,}$/;//City & State Regular Expression
              var str = $(elem).val();
              var match =  regex.test(str);
              var formControlFeedback=$(elem).parents(".form-group").children(".form-control-feedback");//Validation Message Div
                
              if(match){//if match, input is valid
                $scope.addSuccess($(elem));
                formControlFeedback.hide();
                $scope.address = str;
                $scope.getLatitudeLongitude($scope.address);
              }else{//Display error message
                $scope.addError($(elem));
                formControlFeedback.text("Please enter address in correct format (Example: Philadelphia, PA).").show();
                $scope.address = null;
              }
            },
            
          /**
        	 * This method is called in the getLatitudeLongitude function to make sure that that the form is valid before enabling the search for events button
        	 **/
          $scope.checkForErrors = 
            function(){
              var isValid=true;
              $(".form-group").each(
                function(){
                    if(!$(this).hasClass("has-success")){//If one of the form elements do not have the 'has-success' class, the form is invalid
                        isValid=false;
                    }
                }    
              );
              if(isValid){//if valid enable the button
                $("#events-search .btn-success").removeAttr("disabled"); 
              }else{//else disable it
                $("#events-search .btn-success").attr("disabled","");
              }  
            },
          
          /**
        	 * Convenience method used to add error to a form input
        	 * @param elem {{ object }} - The form element to manipulate
        	 **/
          $scope.addError =   
            function(elem){
              elem.parents(".form-group").removeClass("has-error").removeClass("has-success").addClass("has-error");   
            },
            
          /**
        	 * Convenience method used to add success to a form input
        	 * @param {{ object }} - The form element to manipulate
        	 **/
          $scope.addSuccess =
            function(elem){
              elem.parents(".form-group").removeClass("has-error").removeClass("has-success").addClass("has-success");    
            },
          
          /**
        	 * Creates the Google Map from returned JSON data
        	 * @param length {{ number }} - The number of JSON events returned
        	 * @param mapEvents {{ object }} - The JSON object returned from the server 
        	 **/
          $scope.createMap = 
            function(length, mapEvents){
              console.log(mapEvents);
              //The initial position object used to center the map
              var pos = new google.maps.LatLng($scope.latitude, $scope.longitude);
        
              if( $("#map") ){ $("#map").remove(); }//if there is a map present we remove it
              $("<div id='map'></div>").insertAfter($("#events-button"));//insert map in proper place
             
                
              var map = new google.maps.Map($('#map')[0], {//set initial map config
                center: pos,
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROAD
              });
          
              //We set this dynamically so that this doesn't show before the map loads
              $("#map").css("border","3px").css("border-style","solid").css("borderColor" , "#58b358");
          
              // Here we are creating an offset for each marker. If there are multiple markers for the same venue, this ensures that they won't overlap.            
              for(var i=0; i < length; i++){
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
                
                //a new position object that holds the latitude and longitude of a specific event  
                pos = new google.maps.LatLng(mapEvents.events[i]['venue']['location']['latitude'] + latitudeOffset, mapEvents.events[i]['venue']['location']['longitude'] + longitudeOffset);
                  
                var startDate=mapEvents.events[i]['startTime'];//UTC date in return JSON. Example: 2017-12-31T19:30:00-0500
                //console.log("Initial Start Date = " + startDate);
                
                startDate = new Date(startDate);//Create a date object from UTC. Example: Sun Dec 31 2017 19:30:00 GMT-0500 (Eastern Standard Time)
                //console.log("Date Object Start Date = " + startDate);
                
                var startDMY=String(startDate).substring(0,15);//Shortened date month and year as a string. Example: Sun Dec 31 2017
                //console.log("DMY = " + startDMY);
                
                var startTime=$scope.formatAMPM(startDate);//send this to the format method. Example return: 7:30 pm
                //console.log("Start Time = " + startTime);
                
                startDMY = startDMY.substring(0,10) + ", " + startDMY.substring(10,15);//Add comma for date Example: Sun Dec 31, 2017
                startTime = startDMY + " " + startTime;//Fully Formatted Start Time. Example: Sun Dec 31, 2017 7:30 pm
                
                var endDate=mapEvents.events[i]['endTime'];//UTC date in return JSON. Example: 2018-01-01T02:00:00-0500
                //console.log("Initial End Date = " + endDate);
                
                endDate = new Date(endDate);//Create a date object from UTC. Example: Mon Jan 01 2018 02:00:00 GMT-0500 (Eastern Standard Time)
                //console.log("Date Object End Date = " + endDate);
                
                var endDMY=String(endDate).substring(0,15);//Shortened date month and year as a string. Example: Mon Jan 01 2018
                //console.log("DMY = " + endDMY);
                
                var endTime=$scope.formatAMPM(endDate);//send this to the format method. Example return: 2:00 am
                //console.log("End Time = " + endTime);
                
                endDMY = endDMY.substring(0,10) + ", " + endDMY.substring(10,15);//Add comma for date Example: Mon Jan 01, 2018
                
                //If the end DMY isn't equal to the start DMY and the year is greater than 2000, add it to the endTime
                if (endDMY != startDMY && !(endDate.getYear() < 100)){
                  endTime = "<br>" + endDMY + " " + endTime;
                }
                //console.log(endDate.getYear());
                
                //get the description from the returned event      
                var description = mapEvents.events[i]['description'];
                
                try{
                  //shorten the description
                  description= description.substring(0,75) + "...";
                }catch(error){
                  //if there is no description set it to empty string
                  description = " ";
                }
                
                //this is the read more link that will take you to facebook event page      
                var readMore=mapEvents.events[i]['id'];
                readMore= "https://www.facebook.com/events/" + readMore;
                
                //This code creates a data-selector on the twitter button within the tooltip for each marker       
                var dataSelector="data-selector='" + mapEvents.events[i]['venue']['name'] + i + "'";
                dataSelector=escape(dataSelector);
                //console.log(dataSelector);
                
                //Create the marker and the tooltip data associated with it      
                $scope.markers[i] = new google.maps.Marker({
                  position: pos,
                  map: map,
                  tooltipContent : "<strong>Event: </strong><span>" + mapEvents.events[i]['name'] + "</span><br><a href='" + mapEvents.events[i]['coverPicture'] + "' class='event-img' data-lightbox='event-image'><img src='" + mapEvents.events[i]['coverPicture'] + "'/></a><strong>Date & Time: </strong><span> " + startTime + " - " + endTime + "</span><br><strong>Venue: </strong><span class='venue'>" + mapEvents.events[i]['venue']['name'] + "</span><span class='feed-button' data-venue='"+mapEvents.events[i]['venue']['name']+"' data-selector='"+dataSelector+"'><i class='fa fa-twitter' aria-hidden='true'></i>See Tweets</span><br><strong>Location: </strong><span>" + mapEvents.events[i]['venue']['location']['street'] + "</span><br><strong></strong><span>" + mapEvents.events[i]['venue']['location']['city'] + ", " + mapEvents.events[i]['venue']['location']['state'] + " " + mapEvents.events[i]['venue']['location']['zip'] + "</span><br><strong>Description: </strong><span>" + description + "<a target='_blank' href='" + readMore + "'>Read More</a></span>" 
                });
                
                //Bind event handler to marker that shows tooltip content when clicked      
                google.maps.event.addListener($scope.markers[i], 'click', function () {
                  $('.marker-tooltip').html(this.tooltipContent + "<span class='map-close'>x</span>").show();
                });
                
                //Bind event handler to marker that shows tooltip content when hovered
                google.maps.event.addListener($scope.markers[i], 'mouseover', function () {
                  $('.marker-tooltip').html(this.tooltipContent + "<span class='map-close'>x</span>").show();
                });
                
                //Bind event handler to close button for each marker
                $(document).on("click", "span.map-close" , function() {
                  $(this).parent().hide();
                });
                
                //Bind event handler to twitter button when clicked  
                $(document).on("click", "[data-selector='" + dataSelector + "']" , 
                  function() {
                    var venue=jQuery(".venue").text();
                    $scope.grabTweets(venue);
                });
                      
              }
              //When the map is dragged, calculate new center of map and show 'grab events' button
              google.maps.event.addListener(map, "dragend", 
                function() {
                  $scope.latitude=map.getCenter().lat();
                  $scope.longitude=map.getCenter().lng();
                        
                  if($("#events-button").css("visibility","hidden")){
                    $("#events-button").css("visibility","visible");
                  }
                        
                  $("input#address").val("");
                }
              );
              
              $("#ajaxIndicator").hide();//hide the loading indicator when complete  
            },
            
            /**
        	   * Get latitude and longitude using Geocoder to be sent to server and set center of map
        	   **/
            $scope.getLatitudeLongitude = 
              function() {
                // If address is not supplied, use default value 'Ferrol, Galicia, Spain'
                var address = $scope.address || 'Ferrol, Galicia, Spain';
                // Initialize the Geocoder
                var geocoder = new google.maps.Geocoder();
                if (geocoder) {
                    geocoder.geocode({
                        'address': address
                    }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            result=results[0];
                            $scope.latitude=result.geometry.location.lat();
                            $scope.longitude=result.geometry.location.lng();
                            $scope.checkForErrors();//make sure address is valid before enabled 'get events' button
                        }
                    });
                }
              },
            
            /**
             * Mostly borrowed code to grab twitter tweets. I modified this code to send the venue from the specific event for each map marker
             * @param venue {{ string }} The search query to be sent to the Twitter API
             **/  
            $scope.grabTweets = 
              function(venue){
                $('#output').empty();
        
                var search = venue;
                //console.log(search);
                // validate all form input, as needed
                var errorMessages = '';
                var emptyStringPattern = /^$/;
        
                if (emptyStringPattern.test(search)) {
                    errorMessages += 'You must enter a search term.';
                }
        
                if (errorMessages.length > 0) {
                    alert(errorMessages);
                    return false;
                }
        
                $("#ajaxIndicator").show();
                // make the ajax request
                $.ajax({
                  url: 'simple_twitter.php',
                  type: 'GET',
                  dataType: 'JSON',
                  data: {
                      q: search
                  },
                  
                  success: function(serverResponse) {
                      console.log(serverResponse);
                      try {
                          var statuses = serverResponse.statuses;
                          for (var i = 0; i < statuses.length; i++) {
                              //console.log(statuses.length);
                              var tweet = statuses[i];
                              var template = $($("#tweet").prop("content")).children().clone();
                              template.find(".body").text(tweet.text);
                              template.find(".user").text('@' + tweet.user.screen_name);
                              template.find("#retweet").text(tweet.retweet_count);
                              template.find("#favorite").text(tweet.favorite_count);
                              template.find(".profile_image_url").html("<img src=" + tweet.user.profile_image_url + "/>");
                              $("#output").append(template);
                              $("div#twitter-feed h2").show();
                          }
                          
                          if(!statuses.length){
                              $("#output").append("<h3>No Tweets Found.  Please Try Another Venue</h3>");    
                          }
                      }
                      catch (ex) {
                          console.error(ex);
                          $("#errors").text("An error occurred processing the data from Twitter");
                      }
                  },
                  
                  error: function(jqXHR, textStatus, errorThrown) {
                      console.log('error');
                      console.log(errorThrown);
                      console.log(jqXHR);
                  },
                  
                  complete: function() {
                      $("#ajaxIndicator").hide();
                  }
                });
              },
              
              /**
        	     * Formats event time properly to be displayed in marker tooltip
               * Code taken from https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
               * @param date {{ object }} the date object to be correctly formatted
               * @return strTime {{ string }} formatted date as a string
               */
              $scope.formatAMPM =
                function(date){
                  var hours = date.getHours();
                  var minutes = date.getMinutes();
                  var ampm = hours >= 12 ? 'pm' : 'am';
                  hours = hours % 12;
                  hours = hours ? hours : 12; // the hour '0' should be '12'
                  minutes = minutes < 10 ? '0'+minutes : minutes;
                  var strTime = hours + ':' + minutes + ' ' + ampm;
                  return strTime;
                }

    }
  ]
);