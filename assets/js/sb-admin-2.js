    window.onload = hideErrorChangePasswordMessages();

    $(function() {
        $('#side-menu').metisMenu();
    });

    //Loads the correct sidebar on window load,
    //collapses the sidebar on window resize.
    // Sets the min-height of #page-wrapper to window size
    $(function() {
        $(window).bind("load resize", function() {
            topOffset = 50;
            width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
            if (width < 768) {
                $('div.navbar-collapse').addClass('collapse');
                topOffset = 100; // 2-row-menu
            } else {
                $('div.navbar-collapse').removeClass('collapse');
            }

            height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
            height = height - topOffset;
            if (height < 1) height = 1;
            if (height > topOffset) {
                $("#page-wrapper").css("min-height", (height) + "px");
            }
        });

        var url = window.location;
        var element = $('ul.nav a').filter(function() {
            return this.href == url || url.href.indexOf(this.href) == 0;
        }).addClass('active').parent().parent().addClass('in').parent();
        if (element.is('li')) {
            element.addClass('active');
        }
    });

    function hideErrorChangePasswordMessages(){
        $("#error_changePassword").hide();
        $("#error_currentPassword").hide();
        $("#error_newPassword").hide();
        $("#error_newPassword2").hide();
        $("#error_changePassword2").hide();
        hide_loading();
    }

    function show_loading(){
        $('body,html').css('overflow','hidden');
        $("#loading").fadeIn("fast");
        $(".overlay").fadeIn("fast"); 
    }

    function hide_loading(){
        $("#loading").fadeOut("fast");
        $(".overlay").fadeOut("fast"); 
        $('body,html').css('overflow','auto');
    }

    $( "#changePasswordSubmit" ).click(function() {
        hideErrorChangePasswordMessages();
        show_loading();
        var i=0;
        var currentPassword = $('#currentPassword').val().trim();
        var newPassword = $('#newPassword').val().trim();
        var confirmNewPassword = $('#confirmNewPassword').val();

        if(currentPassword == ""){
            $("#error_currentPassword").show();
            i++;
        }
        

        if(newPassword == ""){
            $("#error_newPassword").show();
            i++;
        }
        else if (!newPassword.match(/^[A-Za-z0-9_~\-!@#\$%\^&\*\(\)]{8,30}$/)) {
            $("#error_changePassword2").show();
            i++;
        }
        else if (newPassword != confirmNewPassword) {
            $("#error_newPassword2").show();
            i++;
        }

        if(i == 0){
            $.ajax({
                url: $("#base-url").val() + "authentication/change_password",
                traditional: true,
                type: "post",
                dataType: "text",
                data: {currentPassword:currentPassword, newPassword:newPassword, confirmNewPassword:confirmNewPassword},
                success: function (result) {
                    var result = $.parseJSON(result);
                    if(result.status=='success'){
                        location.reload();
                    }
                    else if(result.status=='invalid'){
                        $("#error_changePassword").show();
                        hide_loading();
                    }
                    else{
                        alert("Oops there is something wrong!");
                    }
                  
                },
                error: ajax_error_handling
            });
        }else{
            hide_loading();
        }
            
    });



    function ajax_error_handling(jqXHR, exception){
        if (jqXHR.status === 0) {
            alert('Not connect.\n Verify Network.');
        } else if (jqXHR.status == 404) {
            alert('Requested page not found. [404]');
        } else if (jqXHR.status == 500) {
            alert('Internal Server Error [500].');
        } else if (exception === 'parsererror') {
            alert('Requested JSON parse failed.');
        } else if (exception === 'timeout') {
            alert('Time out error.');
        } else if (exception === 'abort') {
            alert('Ajax request aborted.');
        } else {
            alert('Uncaught Error.\n' + jqXHR.responseText);
        }
        hide_loading();
    }
