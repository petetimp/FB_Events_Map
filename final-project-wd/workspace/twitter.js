


    function grabTweets(venue){
        //event.preventDefault();
        
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
                        console.log(statuses.length);
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

    }
    