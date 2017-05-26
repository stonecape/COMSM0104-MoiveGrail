/**
 * Created by Frank on 2017/5/26.
 */
function sortChange() {
    var sort_opt = $("#sortSelect").val();
    window.location.href = "?sort_opt=" + sort_opt;
}

$(function () {

    $("#carousel-search-box").bind('keypress', function (event) {
        if (event.keyCode == "13") {
            doSearch('carousel');
        }
    });
});