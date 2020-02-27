// this is my mapboxGL token
// the base style includes data provided by mapbox, this links the requests to my account
mapboxgl.accessToken = 'pk.eyJ1IjoibWVpZ3VhbiIsImEiOiJjazZ1NmFtYmUwNmxpM21xczgzajNmOG5nIn0.OcXexId1dlHq5jAVkL6d2Q';

// we want to return to this point and zoom level after the user interacts
// with the map, so store them in variables
var initialCenterPoint = [-73.9973668, 40.695639]
var initialZoom = 15

// create an object to hold the initialization options for a mapboxGL map
var initOptions = {
  container: 'map-container', // put the map in this container
  style: 'mapbox://styles/meiguan/ck74xkl5i3mbu1ink92c6m7l8', // use this basemap
  center: initialCenterPoint, // initial view center
  zoom: initialZoom, // initial view zoom level (0-18)
}

// create the new map
var map = new mapboxgl.Map(initOptions);

// a helper function for looking up colors and descriptions for NYC land use codes
var boroughLookup = (code) => {
  switch (code) {
    case 'M':
      return {
        color: '#E74C3C',
        description: 'Manhattan',
      };
    case 'B':
      return {
        color: '#F39C12',
        description: 'Brooklyn',
      };
    case 'X':
      return {
        color: '#6E2C00',
        description: 'Bronx',
      };
    case 'Q':
      return {
        color: '#0B5345',
        description: 'Queens',
      };
    case 'R':
      return {
        color: '#4A235A',
        description: 'Staten Island',
      };
  }
};


// add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// wait for the initial style to Load
map.on('style.load', function() {
  // add a geojson source to the map using our external geojson file
  map.addSource('nyc_dog_runs', {
    type: 'geojson',
    data: './data/nycDogRuns.geojson',
  });

  // let's make sure the source got added by logging the current map state to the console
  console.log(map.getStyle().sources)

  // add a layer for our custom source
   map.addLayer({
     id: 'fill-dog-runs',
     type: 'fill',
     source: 'nyc_dog_runs',
     paint: {
       'fill-color': {
         type: 'categorical',
         property: 'borough',
         stops: [
           [
             'M',
             boroughLookup('M').color,
           ],
           [
             'B',
             boroughLookup('B').color,
           ],
           [
             'X',
             boroughLookup('X').color,
           ],
           [
             'Q',
             boroughLookup('Q').color,
           ],
           [
             'R',
             boroughLookup('R').color,
           ]
         ]
       }
     }
   })

 });
