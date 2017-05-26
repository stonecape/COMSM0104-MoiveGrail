/* Created by Frank CHEN on 2017/5/26.
 */
function doSearch(loc) {
    var search_text
    if(loc === 'top') {
        search_text = $("#top_search_box").val();
    } else {
        search_text = $("#carousel-search-box").val();
    }

    if(search_text.length > 0){
        $.ajax({
            type: "GET",
            url : "/search",
            dataType: 'json',
            async : false,
            data:{"search_text":search_text},
            success: function(data) {
                if(data.result && data.detail) {
                    window.location.href="/mdetail?id="+data.detail;
                } else {
                    $("#top_search_box").val("");
                    $("#carousel-search-box").val("");
                }
            }
        });
    }
}
function submitLogInForm() {
    $('#login_inputUserNamePop').popover('destroy');
    $('#login_inputPasswordPop').popover('destroy');
    $('#login_submit_btn_popover').popover('destroy');

    var userName = $("#login_inputUserName").val();
    var password = $("#login_inputPassword").val();

    if (userName.length <= 0) {
        $('#login_inputUserNamePop').popover({title: "Woops!", content: "Please type your username."});
        $('#login_inputUserNamePop').popover('show');
        return false;
    }
    if (password.length < 6 || password.length > 12) {
        $('#login_inputPasswordPop').popover({title: "Woops!", content: "Please type your password correctly."});
        $('#login_inputPasswordPop').popover('show');
        return false;
    }

    var result;
    $.ajax({
        type: "POST",
        url : "/login/submit",
        dataType: 'text',
        async : false,
        data:{"userName":userName, "password":password},
        success: function(data) {
            result = data;
        }
    });
    if(result === "true") {
        location.reload();
    } else {
        $('#login_submit_btn_popover').popover({title: "Woops!", content: "Username or password is wrong."});
        $('#login_submit_btn_popover').popover('show');
    }
}
function logoutFuc() {
    var result;
    $.ajax({
        type: "GET",
        url: "/logout",
        dataType: 'text',
        async: false,
        data: {},
        success: function (data) {
            result = data;
        }
    });
    if (result === "true") {
        location.reload();
    }
}
$(function () {
    var result;
    $.ajax({
        type: "GET",
        url: "/login/getcookie",
        dataType: 'text',
        async: false,
        data: {},
        success: function (data) {
            result = data;
        }
    });
    if (result) {
        $('#unlog_login_btn').hide();
        $('#unlog_join_btn').hide();
        $('#logout_btn').html(result+" logout");
    } else {
        $('#logout_btn').hide();
    }


    $("#top_search_box").bind('keypress',function(event){
        if(event.keyCode == "13")
        {
            doSearch('top');
        }
    });
});
