/*
  Maps, geolocalization and things so... :D
*/
LL.ui = {

  $geoB: $('.b-gps-coordinates'),

  updateGeoBox: function(c, place_name) {

    if (c.isValid()) {

      var
        lat = roundFloat(c.getLat().toDec(),5),
        lng = roundFloat(c.getLng().toDec(),5),
        dd_s= lat+' '+lng;
        // f = ['DD', 'DMS', 'UTM', 'GEOHASH'];
      this.$geoB.find('#DD').val(dd_s);
      $('.home-DD').val(dd_s);
      this.$geoB.find('#DMS').val(c.getLat().toDMSString()+' '+c.getLng().toDMSString());
      this.$geoB.find('#UTM').val(c.toUTMString());
      this.$geoB.find('#GEOHASH').val(c.geohash);

      // Blink
      // input don't trigger onchange
      this.$geoB.find('input:text,textarea').addClass('blink');
      setTimeout(function(){
        LL.ui.$geoB.find('input:text,textarea').removeClass('blink');
      },1000);

      // Title of GEOBox
      if (typeof place_name === 'undefined') {
        this.$geoB.find('.title b').text(' custom point');
        this.updateURL(lat, lng);
      } else {
        this.$geoB.find('.title b').text(decodeURIComponent(place_name));
        this.updateURL(lat, lng, place_name);
      }

    } else {
      // Show error
      console.log('Invalid coordinates!');
    }

  },

  updateURL: function(lat, lng, place_name) {
    var
      url = '/lat/'+lat+'/lng/'+lng,
      page_title = 'GPS Coordinates for ';
    if (typeof place_name === 'undefined') {
      page_title = page_title + 'latitude: '+lat+', longitude: '+lng;
    } else {
      page_title = page_title + decodeURIComponent(place_name) + '. Latitude: '+lat+', longitude: '+lng;
      url = url+'/place/'+place_name;
    }
    document.title = page_title;
    window.history.replaceState(null, place_name, url);
  },

  getJSON: function() {
    var
      dd_s = this.$geoB.find('#DD').val(),
      json = {};
    c = new GPS(dd_s);
    // console.log(c);
    if (c.isValid()) {
      json.DD = {};
      json.DMS = {};
      json.DD.lat = roundFloat(c.getLat().toDec(),5);
      json.DD.lng = roundFloat(c.getLng().toDec(),5);
      json.DMS.lat = c.getLat().toDMSString();
      json.DMS.lng = c.getLng().toDMSString();
      json.geohash = c.geohash;
      json.UTM = c.toUTMString();
      return JSON.stringify(json);
    } else {
      return 'ERROR! Coordinates are invalid!.';
    }
  },

  updateHomeMarker: function() {
    var
      pos = {};
    pos.latlng = {
      pin: 'coo',
      lat: c.lat.toDec(),
      lng: c.lon.toDec(),
      draggable: true,
      iw: LL.msg.drag
    };
    gmz.deleteAllMarkers().addLocations(pos);
    gmz.iws.latlng.open(gmz.map, gmz.markers.latlng);
    gmz.map.panTo(gmz.markers.latlng.getPosition());
    LL.ui.updateGeoBox(c);
  }

};
