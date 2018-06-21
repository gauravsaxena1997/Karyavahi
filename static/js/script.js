/*-------------------------------------------------------------------------------------------------*/

/* modal vertically middle align */
function reposition() {
    var modal = $(this),
            dialog = modal.find('.modal-dialog');
    modal.css('display', 'block');
    if (dialog.height() > $(window).height())
        dialog.css("margin-top", 10);
    else
        dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
}
$('.modal').on('show.bs.modal', reposition);
$(window).on('resize', function () {
    $('.modal:visible').each(reposition);
});
/*login templates*/
$('body').on({click: function() {$(this).parents('section.login-content').hide().siblings($(this).attr('href')).show();}}, '.switch-link');
 $('.login-close').on('click', function () {
        window.location.reload('/');
    })
/*login templates end*/
/*-------------------------------------------------------------------------------------------------*/

/* modal for login */
//$('#loginModal').modal('show');

/*-------------------------------------------------------------------------------------------------*/
/* Accordion for Agency Engineer module*/
$('.collapse').on('show.bs.collapse', function () {
    $(this).parents('.panel').addClass('expanded');
});

$('.collapse').on('hide.bs.collapse', function () {
    $(this).parents('.panel').removeClass('expanded');
});

/*-------------------------------------------------------------------------------------------------*/
$(document).ready(function () {
    $('body').on({
        click: function () {
            $('.navbar-collapse').animate({scrollTop: $('.navbar-collapse .dropdown-menu').height()}, 600);
        }
    }, '.navbar-nav .dropdown-toggle');
});
$(document).ready(function () {
    $('body').on({
        click: function () {
            if ($(this).parents('.body-panel').hasClass('open')) {
                $(this).parent().siblings('.row-collapse').children('td').find('.slide').slideUp(600, function () {
                    $(this).parent().removeClass('in');
                    getHeight($(this).parents('.body-panel'));
                });
                $(this).parents('.body-panel').removeClass('open');
            }

            else {
                $(this).parent().siblings('.row-collapse').children('td').addClass('in').find('.slide').slideDown(600, function () {
                    getHeight($(this).parents('.body-panel'));
                });
                $(this).parents('.body-panel').addClass('open');
                $(this).parents('.body-panel').siblings().removeClass('open');
                $(this).parents('.body-panel').siblings().children('tr').children('td').find('.slide').slideUp(600, function () {
                    $(this).parent().removeClass('in');
                });
            }

            /*Animation Scrolltop*/
            function getHeight(e) {
                var $window = $(window);
                if (e.height() < $window.height())
                    var pullTop = e.offset().top - (($window.height() - e.height()) / 2);
                else
                    var pullTop = e.offset().top;
                $('html, body').animate({scrollTop: pullTop}, 1000)
            }
        }
    }, '.row-toggle > .el-toggle');

    /*Equal height column*/
    var maxHeight = 0;
    $(".tpls-table-container > div > .tpls-total").each(function () {
        if ($(this).height() > maxHeight) {
            maxHeight = $(this).height();
        }
    });
    $(".tpls-table-container > div > .tpls-total").height(maxHeight);

    /* For Dashboard map box*/
    var $window = $(window);
    function checkWidth() {
        var rWidth = $window.width();
        var boxLeft = ((rWidth - 1000) / 2);
        if (rWidth > 992) {
            $('.tpls-maps-box').css({'left': boxLeft});
        }
    }
    checkWidth();

    $window.resize(checkWidth);

});