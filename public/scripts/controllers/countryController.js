'use strict';

(function(mod) {
  const countryController = {};

//   articleController.index = function(ctx, next) {
//   if(ctx.articles.length) {
//     articleView.index(ctx.articles);
//   } else{
//     page('/');
//   }
// };
  countryController.index = function() {
    console.log('in country controller.index');
    $('#map').css('height', '100%');
    $('html').css({'height':'100%', 'margin':'0', 'padding':'0'});
    $('body').css({'height':'100%', 'margin':'0', 'padding':'0'});
    $('section').fadeOut();
    somaliaView.makeMap();
    $('#map').fadeIn();
  };

  mod.countryController = countryController;
})(window);
