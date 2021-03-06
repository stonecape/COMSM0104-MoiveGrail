/**
 * Created by Frank CHEN on 2017/5/26.
 */
function submitLogInForm() {
    $('#inputUserNamePop').popover('destroy');
    $('#inputPasswordPop').popover('destroy');
    $('#login_submit_btn_popover').popover('destroy');

    var userName = $("#inputUserName").val();
    var password = $("#inputPassword").val();

    if (userName.length <= 0) {
        $('#inputUserNamePop').popover({title: "Woops!", content: "Please type your username."});
        $('#inputUserNamePop').popover('show');
        return false;
    }
    if (password.length < 6 || password.length > 12) {
        $('#inputPasswordPop').popover({title: "Woops!", content: "Please type your password correctly."});
        $('#inputPasswordPop').popover('show');
        return false;
    }

    var result;
    $.ajax({
        type: "POST",
        url : "/login/submit",
        dataType: 'json',
        async : false,
        data:{"userName":userName, "password":password},
        success: function(data) {
            result = data;
        }
    });

    if(result == true) {
        window.location.href = "/";
    } else {
        $('#login_submit_btn_popover').popover({title: "Woops!", content: "Username or password is wrong."});
        $('#login_submit_btn_popover').popover('show');
    }
}