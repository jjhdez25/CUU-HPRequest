var App = function () {
    // Helper variables - set in uiInit()
    var $lPage, $lSidebar, $lSidebarScroll, $lSideOverlay, $lSideOverlayScroll;



    // User Interface init
    var uiInit = function () {
        // Set variables
        $lPage = $('#page-container');
        $lSidebar = $('#sidebar');
        $lSidebarScroll = $('#sidebar-scroll');
        $lSideOverlay = $('#side-overlay');
        $lSideOverlayScroll = $('#side-overlay-scroll');
    };

    // Layout functionality
    var uiLayout = function () {
        // Resizes #main-container min height (push footer to the bottom)
        var $resizeTimeout;
        // Init sidebar and side overlay custom scrolling
        uiHandleScroll('init');
    };

    // Handles sidebar and side overlay custom scrolling functionality
    var uiHandleScroll = function ($mode) {
        var $windowW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        // Init scrolling
        if ($mode === 'init') {
            // Init scrolling only if required the first time
            uiHandleScroll();

            // Handle scrolling on resize or orientation change
            var $sScrollTimeout;

            $(window,document).on('resize orientationchange scroll', function () {
                clearTimeout($sScrollTimeout);
                $sScrollTimeout = setTimeout(function () {
                    uiHandleScroll();
                }, 150);
            });
        } else {
            // If screen width is greater than 991 pixels and .side-scroll is added to #page-container
            if ($windowW > 768 && $lPage.hasClass('side-scroll')) {
                // Turn scroll lock off (sidebar and side overlay - slimScroll will take care of it)
                $($lSidebar).scrollLock('disable');
                $($lSideOverlay).scrollLock('disable');
                // If sidebar scrolling does not exist init it..
                if ($lSidebarScroll.length && (!$lSidebarScroll.parent('.slimScrollDiv').length)) {
                    $lSidebarScroll.slimScroll({
                        height: $lSidebar.outerHeight(),
                        color: '#fff',
                        size: '5px',
                        opacity: .35,
                        wheelStep: 15,
                        distance: '3px',
                        railVisible: false,
                        railOpacity: 1,
                        size: '10px',
                        alwaysVisible: true
                    });
                }
                else { // ..else resize scrolling height
                    $lSidebarScroll
                        .add($lSidebarScroll.parent())
                        .css('height', $lSidebar.outerHeight());
                }
                // If side overlay scrolling does not exist init it..
                if ($lSideOverlayScroll.length && (!$lSideOverlayScroll.parent('.slimScrollDiv').length)) {
                    $lSideOverlayScroll.slimScroll({
                        height: $lSideOverlay.outerHeight(),
                        color: '#000',
                        size: '5px',
                        opacity: .35,
                        wheelStep: 15,
                        distance: '3px',
                        railVisible: false,
                        railOpacity: 1,
                        size: '10px',
                        alwaysVisible: true
                    });
                }
                else { // ..else resize scrolling height
                    $lSideOverlayScroll
                        .add($lSideOverlayScroll.parent())
                        .css('height', $lSideOverlay.outerHeight());
                }
            }
        }
    };

    return {
        init: function ($func) {
            uiInit();
            uiLayout();
        }
    };
}();

// Initialize app when page loads
$(function () {
    if (typeof angular == 'undefined') {
        App.init();
    }
});

$(document).ready(function () {
    $('.slimScrollBar').css("display", "none")
        .hover(function () {
            $(this).css("display", "block");
        }, function () {
            $(this).css("display", "none");
        });
    $('#sidebar-scroll').hover(function () {
        if ($('.sidebar-content').height() < $('.slimScrollDiv').height()) {
            $('.slimScrollBar').css("display", "none");
        }
    },
    function () {
        $('.slimScrollBar').css("display", "none");
    });


    // Initialize Tabs
    jQuery('[data-toggle="tabs"] a, .js-tabs a').click(function (e) {
        e.preventDefault();
        jQuery(this).tab('show');
    });
});