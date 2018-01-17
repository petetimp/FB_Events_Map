jQuery(document).ready(
    function(){
        jQuery("#address").keyup(
            function(){
                var regex = /^[A-Za-z ]+,[ ]?[A-Za-z]{2,}$/;
                var str = $(this).val();
                var match =  regex.test(str);
                var formControlFeedback=jQuery(this).parents(".form-group").children(".form-control-feedback");
                
                if(match){
                    addSuccess(jQuery(this));
                    formControlFeedback.hide();
                    address=str;
                    getLatitudeLongitude(address);
                }else{
                    addError($(this));
                    formControlFeedback.text("Please enter address in correct format (Example: Philadelphia, PA).").show();
                    address=null;
                }
                
                checkForErrors();
            }    
        );
        function checkForErrors(){
            var isValid=true;
            $(".form-group").each(
                function(){
                    if(!$(this).hasClass("has-success")){
                        isValid=false;
                        //console.log("not valid");
                    }
                }    
            );
            if(isValid){
                $("#events-search .btn-success").removeAttr("disabled"); 
                //console.log("valid");
            }else{
                $("#events-search .btn-success").attr("disabled","");
            }
        }
        
        function addError(elem){
            elem.parents(".form-group").removeClass("has-error").removeClass("has-success").addClass("has-error");   
        }
        
        function addSuccess(elem){
            elem.parents(".form-group").removeClass("has-error").removeClass("has-success").addClass("has-success");    
        }
    }    
);