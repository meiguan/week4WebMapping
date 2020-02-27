// this is my mapboxGL token
// the base style includes data provided by mapbox, this links the requests to my account
mapboxgl.accessToken = 'pk.eyJ1IjoibWVpZ3VhbiIsImEiOiJjazZ1NmFtYmUwNmxpM21xczgzajNmOG5nIn0.OcXexId1dlHq5jAVkL6d2Q';

// we want to return to this point and zoom level after the user interacts
// with the map, so store them in variables
var initialCenterPoint = [-73.9964609,40.7295134]
var initialZoom = 11


// create an object to hold the initialization options for a mapboxGL map
var initOptions = {
  container: 'map-container', // put the map in this container
  style: 'mapbox://styles/meiguan/ck6uyoshh02ma1iqk7x60lf1f', // use this basemap
  center: initialCenterPoint, // initial view center
  zoom: initialZoom, // initial view zoom level (0-18)
}

// create the new map
var map = new mapboxgl.Map(initOptions);

// add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// iterate over each object in collegesData
collegesData.forEach(function(collegeEntry) {
  var el = document.createElement('div');
  el.className = 'marker';
  // for each object in the studentData, add a marker to the map with a popup
  new mapboxgl.Marker(el)
    .setLngLat([collegeEntry.geo_longitude, collegeEntry.geo_latitude])
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML(`${collegeEntry.inst_name} is located ${collegeEntry.county_name}`))
    .addTo(map);
})

// event listeners for the fly to buttons

$('#NewYorkCity').on('click', function() {
  map.flyTo({
    center: [-73.997,	40.7297],
    zoom: initialZoom
  })
})

$('#FingerLakes').on('click', function() {

  var fingerLakesLngLat = [-76.496331,42.4395155]

  map.flyTo({
    center: fingerLakesLngLat,
    zoom: initialZoom
  })
})

$('#Albany').on('click', function() {
  var albanyLngLat = [-73.8335277,42.6849853]

  map.flyTo({
    center: albanyLngLat,
    zoom: initialZoom
  })
})

$('#Buffalo').on('click', function() {
  var buffaloLngLat = [-78.7911584,43.0008132]

  map.flyTo({
    center: buffaloLngLat,
    zoom: initialZoom
  })
})
