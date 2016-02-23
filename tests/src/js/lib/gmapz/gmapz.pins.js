// Pins must be defined BEFORE map initialization
GMapz.pins = {};
$.each(['default','air','art','nat','mus','cit','coo'], function(index, pimg) {
  GMapz.pins[pimg] = {
    pin: {
      img:'/img/gmapz/pin-'+pimg+'.png',
      size: [64.0, 64.0],
      anchor: [32.0, 64.0]
    }
  };
});
