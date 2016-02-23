var
  c;

$(document).ready(function() {
  // La magia aquí
  'use strict';

  $('#js-download-json-coords').on('click', function(e) {
    e.preventDefault();
    var
      link = document.createElement('a');
    link.download = 'coordinates.json';
    link.href = 'data:text/plain,'+LL.ui.getJSON();
    link.click();
  });

  // Focus style on autocomplete fields
  $('.main-search, .g-search-header').on('click', function(e) {
    $('body').addClass('focus-main-search');
  }).on('blur', function(e) {
    $('body').removeClass('focus-main-search');
  });

  // Seleccionar al hacer click
  $('.b-gps-coordinates').on('click', 'input[type="text"], textarea', function () {
    $(this).select();
  });

  // Update satellite map coordinates on click
  $('.show-satellite-map a').on('click', function(e) {
    e.preventDefault();
    var
      $m = $('#gmapz'),
      m = $m[0].gmapz.map,
      map_wh = { width: $m.width(), height: $m.height() },
      zoom = LL.maps.getBoundsZoomLevel(m.getBounds(), map_wh),
      lat = m.getCenter().lat(),
      lng = m.getCenter().lng(),
      url = 'http://maps.google.com/maps?';
    if ($(this).attr('href').indexOf('q=') > -1) {
      url = url+'q='+lat+','+lng+'&';
    }
    url = url+'ll='+lat+','+lng+'&t=k&hl=en&z='+zoom;
    $(this).attr('href', url);
    var $a = $('<a target="_blank">').attr('href', url);
    $a[0].click();
  });

  // Autocomplete inner sections
  if ($('.g-search-header').length) {
    var auc = new GMapz.autocomplete($('.g-search-header'));
    auc.onChange = function () {
      var
        lat, lng, address,
        place = this.instance.getPlace();
      if (typeof place.geometry === 'undefined') {
        return false;
      }
      lat = place.geometry.location.lat();
      lng = place.geometry.location.lng();
      address = place.formatted_address;
      window.location.href = '/lat/'+lat+'/lng/'+lng+'/place/'+encodeURIComponent(address);
    };
  }

  // Find location in the home
  $('#find-location').on('click', function(e) {
    e.preventDefault();
    c = new GPS($('.home-DD').val());
    if (c.isValid()) {
      $('.home-DD').removeClass('error');
      $('.error-in-coordinates').html('');
      $('.g-search').val('').attr('placeholder','Type a location...');
      LL.ui.updateHomeMarker();
    } else {
      $('.home-DD').addClass('error');
      $('.error-in-coordinates').html('').append($('<span>').text( LL.msg.error_coord )).slideDown();
    }
  });

  $(window).keydown(function(event){
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });

});

// Convert main nav to selects
$(document).on('enter.mobile.mqbe', function() {

  $('ul.main-nav, ul.submenu-nav').ul2select({
    active_class: 'current',
    add_empty_option: true,
    custom_events: {
      'change': function(){
        var url = $(this).find('option:selected').attr('value');
        if (url !== "0") {
          window.location.href = url;
        }
      }
    }
  });

  $('.b-listing-actions ul.sort').ul2select({
    active_class: 'current',
    custom_events: {
      'change': function(){
        var url = $(this).find('option:selected').attr('value');
        window.location.href = url;
      }
    }
  });

}).on('leave.mobile.mqbe', function() {
  $('.u2s-wrapper select').ul2select('revert');
});
