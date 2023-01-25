$('.header__mobile-burger').on("click", function(){
    $("html, body").addClass("body-fixed");
    $('.header-mobile__wrapper').addClass('active');
});

$('.header-mobile__close').on("click", function(){
    $("html, body").removeClass("body-fixed");
    $('.header-mobile__wrapper').removeClass('active');
});

$('.main-slider__navItem').click(function () {
    $('.main-slider__navItem').removeClass('active');
    $(this).addClass('active');

    $('.main-slider__item').removeClass('active');
    $($('.main-slider__item')[$(this).index()]).addClass('active');
});

$('.main-slider__navButton').click(function () {
    var index = $('.main-slider__navItem.active').index();

    if ($(this).hasClass('top')) {
        if (index !== 0) {
            $($('.main-slider__navItem')[index - 1]).trigger('click');
        } else {
            $($('.main-slider__navItem')[$('.main-slider__navItem').length - 1]).trigger('click');
        }
    } 
    else {
        if (index < $('.main-slider__navItem').length - 1) {
            $($('.main-slider__navItem')[index + 1]).trigger('click');
        } else {
            $($('.main-slider__navItem')[0]).trigger('click');
        }
    }
});

