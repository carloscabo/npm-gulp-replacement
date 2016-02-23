/*
  Maps, geolocalization and things so... :D
*/
LL.maps = {

  getBoundsZoomLevel: function(bounds, mapDim) {
    var
      WORLD_DIM = { height: 256, width: 256 },
      ZOOM_MAX = 21,

      ne = bounds.getNorthEast(),
      sw = bounds.getSouthWest(),

      latFraction = (LL.maps.latRad(ne.lat()) - LL.maps.latRad(sw.lat())) / Math.PI,

      lngDiff = ne.lng() - sw.lng(),
      lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360,

      latZoom = LL.maps.zoom(mapDim.height, WORLD_DIM.height, latFraction),
      lngZoom = LL.maps.zoom(mapDim.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
  },

  latRad: function (lat) {
    var
      sin = Math.sin(lat * Math.PI / 180),
      radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
  },

  zoom: function (mapPx, worldPx, fraction) {
    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
  }

};
