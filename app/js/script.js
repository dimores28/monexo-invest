$('.header__mobile-burger').on("click", function(){
    $("html, body").addClass("body-fixed");
    $('.header-mobile__wrapper').addClass('active');
});

$('.header-mobile__close').on("click", function(){
    $("html, body").removeClass("body-fixed");
    $('.header-mobile__wrapper').removeClass('active');
});