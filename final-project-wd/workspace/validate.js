jQuery(document).ready(
    function(){
        jQuery("#address").keyup(
            function(){
                var regex=/^[A-Za-z ]+,[ ]?[A-Za-z]{2,}$/;
                var str=jQuery(this).val();
                var match=regex.test(str);
                var formControlFeedback=jQuery(this).parents(".form-group").children(".form-control-feedback");
                
                if(match){
                    addSuccess(jQuery(this));
                    formControlFeedback.hide();
                    address=str;
                    getLatitudeLongitude(address);
                }else{
                    addError(jQuery(this));
                    formControlFeedback.text("Please enter address in correct format (Example: Philadelphia, PA).").show();
                    address=null;
                }
                
                checkForErrors();
            }    
        );
        /* Old Code
        jQuery("#distance").keyup(
            function(){
                distance=parseInt(jQuery(this).val());
                var formControlFeedback=jQuery(this).parents(".form-group").children(".form-control-feedback");
                
                if(distance > 0 && distance <= 100){
                    addSuccess(jQuery(this));
                    
                    formControlFeedback.hide();
                    distance= parseInt(distance * 1609.34);
                }else{
                    addError(jQuery(this));
                    formControlFeedback.text("Please enter a value between 1 and 100").show();
                }
                
                checkForErrors();
            }    
        );*/
        
        
        function checkForErrors(){
            var isValid=true;
            jQuery(".form-group").each(
                function(){
                    if(!jQuery(this).hasClass("has-success")){
                        isValid=false;
                        //console.log("not valid");
                    }
                }    
            );
            if(isValid){
                jQuery("#events-search .btn-success").removeAttr("disabled"); 
                //console.log("valid");
            }else{
                jQuery("#events-search .btn-success").attr("disabled","");
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