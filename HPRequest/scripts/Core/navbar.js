﻿$(document).ready(function() {
    $(".navbar a.dropdown-toggle").on("click", function(n) {
        var t = $(this), e = $(this).offsetParent(".dropdown-menu");
        return $(this).parent("li").toggleClass("open"), e.parent().hasClass("nav") || t.next().css({ top: t[0].offsetTop, left: e.outerWidth() - 4 }), $(".nav li.open").not($(this).parents("li")).removeClass("open");
    });
});