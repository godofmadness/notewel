/**
 * Created by mm on 3/31/17.
 */
$(document).ready(function(){
  console.log("in carousel")

  $('.carousel-custom').slick({
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear'
  });

});
