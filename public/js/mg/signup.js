/**
 * Created by Frank CHEN on 2017/5/26.
 */
function emptyPop() {
    $('#inputPasswordPop').popover('destroy');
    $('#inputRePasswordPop').popover('destroy');
}
function checkForm(){
    var userName = $("#inputUserName").val();
    var password = $("#inputPassword").val();
    var repassword = $("#inputRePassword").val();

    if(userName.length <= 0) {
        $('#inputUserNamePop').popover({title: "Woops!", content: "Please type your username."});
        $('#inputUserNamePop').popover('show');
        return false;
    }

    if(checkUserName()) {
        // check whether the username has been registered
        // true: hasn't been registered
        if(password !== repassword) {
            $('#inputRePasswordPop').popover({title: "Woops!", content: "Please retype your password correctly."});
            $('#inputRePasswordPop').popover('show');
            return false;
        }

        if(password.length < 6) {
            $('#inputPasswordPop').popover({title: "Woops!", content: "You need to type passwords between 6 and 12 characters."});
            $('#inputPasswordPop').popover('show');
            return false;
        }

        if(password.length > 12) {
            $('#inputPasswordPop').popover({title: "Woops!", content: "You need to type passwords between 6 and 12 characters."});
            $('#inputPasswordPop').popover('show');
            return false;
        }
        return true;
    }

    return false;

}

function checkUserName() {
    $('#inputUserNamePop').popover('destroy');
    var userName = $("#inputUserName").val();
    var result;
    if(userName.length > 0) {
        $.ajax({
            type : "POST",
            url : "/signup/checkusername",
            dataType: 'text',
            data : {"userName":userName },
            async : false,
            success : function(data){
                result = data;
            }
        });
        if(result === "false") {

            $('#inputUserNamePop').popover({title: "Woops!", content: "This username has been registered. Please type another one."});
            $('#inputUserNamePop').popover('show');
            return false;
        } else {
            return true;
        }

    }
}