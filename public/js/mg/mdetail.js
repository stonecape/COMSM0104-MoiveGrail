/**
 * Created by Frank CHEN on 2017/5/26.
 */
function likeComment(comment_id) {
    var res;
    $.ajax({
        type: "GET",
        url : "/mdetail/likecomment",
        dataType: 'json',
        async : false,
        data : {"comment_id":comment_id},
        success: function(data) {
            res = data;
        }
    });
    if(res.result) {
        location.reload();
    }
}
function dislikeComment(comment_id) {
    var res;
    $.ajax({
        type: "GET",
        url : "/mdetail/dislikecomment",
        dataType: 'json',
        async : false,
        data : {"comment_id":comment_id},
        success: function(data) {
            res = data;
        }
    });
    if(res.result) {
        location.reload();
    }
}
function checkIsLogin() {
    $('#addNewCommentPop').popover('destroy');
    var isLoginResult;
    $.ajax({
        type: "GET",
        url : "/login/checkIsLogin",
        dataType: 'text',
        async : false,
        success: function(data) {
            isLoginResult = data;
        }
    });
    if(isLoginResult === "false") {
        $('#addNewCommentPop').popover({title: "Woops!", content: "Please Sign In First."});
        $('#addNewCommentPop').popover('show');
        return false;
    }
    return true;
}
$(document).ready(function(){
    re= /exec|count|=|;|>|</i;
    $('#addNewCommentPop').popover('destroy');
    $("#confirmSubmit").click(function(){

        if(!checkIsLogin()) {
            return;
        }

        var comment_content = $("#addNewComment").val();
        if(comment_content.length < 1) {
            $('#addNewCommentPop').popover({title: "Woops!", content: "Write your ideas and submit again."});
            $('#addNewCommentPop').popover('show');
            return;
        }
        if (re.test(comment_content)){
            $('#addNewCommentPop').popover({title: "Woops!", content: "unexamined(illegal) input is not worth submitting."});
            $('#addNewCommentPop').popover('show');
            $("#addNewComment").val("");
            return;
        }
        var isAnonymous;
        if($("#isAnonymous").is(':checked')) {
            isAnonymous = 1;
        } else {
            isAnonymous = 0;
        }
        var movie_id = $("#movie_id").val();
        var rank = $("#count").text();
        if(rank < 1) {
            $('#addNewCommentPop').popover({title: "Woops!", content: "Don't forget to rank this movie, please."});
            $('#addNewCommentPop').popover('show');
            return;
        }

        var sresult;
        $.ajax({
            type: "POST",
            url : "/mdetail/addcomment",
            dataType: 'json',
            async : false,
            data:{"isAnonymous":isAnonymous, "movie_id":movie_id, "comment_content":comment_content, "rank":rank},
            success: function(data) {
                sresult = data;
            }
        });
        if(sresult.result === true) {
            location.reload();
        } else {
            $('#addNewCommentPop').popover({title: "Woops!", content: sresult.detail});
            $('#addNewCommentPop').popover('show');
        }

    });
});