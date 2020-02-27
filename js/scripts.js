// this is my mapboxGL token
// the base style includes data provided by mapbox, this links the requests to my account
mapboxgl.accessToken = 'pk.eyJ1IjoibWVpZ3VhbiIsImEiOiJjazZ1NmFtYmUwNmxpM21xczgzajNmOG5nIn0.OcXexId1dlHq5jAVkL6d2Q';

// we want to return to this point and zoom level after the user interacts
// with the map, so store them in variables
var initialCenterPoint = [-73.9968643,40.7060855]
var initialZoom = 10

// create an object to hold the initialization options for a mapboxGL map
var initOptions = {
  container: 'map-container', // put the map in this container
  style: 'mapbox://styles/mapbox/light-v10', // use this basemap
  center: initialCenterPoint, // initial view center
  zoom: initialZoom, // initial view zoom level (0-18)
}

// create the new map
var map = new mapboxgl.Map(initOptions);

// a helper function for looking up colors and descriptions for NYC land use codes
var dogCountLookup = (code) => {
  switch (code) {
    case '0-200':
      return {
        color: '#ffbe00',
        description: '0-200 Dogs in this zipcode',
      };
    case '201 - 400':
      return {
        color: '#ffac11',
        description: '201 - 400 Dogs in this zipcode',
      };
    case '401 - 600':
      return {
        color: '#ff9a21',
        description: '401 - 600 Dogs in this zipcode',
      };
    case '601 - 800':
      return {
        color: '#ff882f',
        description: '601 - 800 Dogs in this zipcode',
      };
    case '801 - 1000':
      return {
        color: '#ff753b',
        description: '801 - 1000 Dogs in this zipcode',
      };
    case '1001 - 1200':
        return {
          color: '#ff6347',
          description: '1001 - 1200 Dogs in this zipcode',
        };
    case '1200+':
        return {
          color: '#ff5252',
          description: '1200+ Dogs in this zipcode',
        };
      }
    };

var defaultText = '<p> Scroll for dog population details at each zipcode. </p>'
$('#feature-info').html(defaultText)


// add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// wait for the initial style to Load
map.on('style.load', function() {

  // add a geojson source to the map using our external geojson file
  map.addSource('nyc_dog_pop', {
    type: 'geojson',
    data: './data/dogs.geojson',
  });

  map.addSource('nyc_dog_runs', {
    type: 'geojson',
    data: './data/nycDogRuns.geojson',
  })

  // let's make sure the source got added by logging the current map state to the console
  console.log(map.getStyle().sources)

  // add a layer for our custom source
   map.addLayer({
     id: 'fill-dog-pop',
     type: 'fill',
     source: 'nyc_dog_pop',
     paint: {
       'fill-color': {
         type: 'categorical',
         property: 'dogrange',
         stops: [
           [
             '0-200',
             dogCountLookup('0-200').color,
           ],
           [
             '201 - 400',
             dogCountLookup('201 - 400').color,
           ],
           [
             '401 - 600',
             dogCountLookup('401 - 600').color,
           ],
           [
             '601 - 800',
             dogCountLookup('601 - 800').color,
           ],
           [
             '801 - 1000',
             dogCountLookup('801 - 1000').color,
           ],
           [
             '1001 - 1200',
             dogCountLookup('1001 - 1200').color,
           ],
           [
             '1200+',
             dogCountLookup('1200+').color,
           ]
         ]
       }
     }
   })

// add a layer for borders
    map.addLayer({
      id:'line-zipcode',
      type: 'line',
      source: 'nyc_dog_pop',
      before:['fill-dog-pop'],
      paint: {
        'line-color': '#000',
        'line-width': 0.5,
          }
    });

// add a layer for dog Runs
map.addLayer({
  id:'fill-dog-runs',
  type:'fill',
  source:'nyc-dog-runs',
  paint:{
    'fill-color': '#32CD32',
  }
})

// add an empty data source, which we will use to highlight the lot the user is hovering over
  map.addSource('highlight-feature', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  })

// listen for the mouse moving over the map and react when the cursor is over our data
  map.on('mousemove', function (e) {
    // query for the features under the mouse, but only in the lots layer
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['fill-dog-pop'],
    });

    // if the mouse pointer is over a feature on our layer of interest
    // take the data for that feature and display it in the sidebar
    if (features.length > 0) {
      map.getCanvas().style.cursor = 'pointer';  // make the cursor a pointer

      var hoveredFeature = features[0]
      var featureInfo = `
        <h4>${hoveredFeature.properties.po_name}, ${hoveredFeature.properties.postalcode}</h4>
        <h4>${hoveredFeature.properties.dogcount} Dogs Registered in zipcode</h4>
        `
      $('#feature-info').html(featureInfo)

      // set this lot's polygon feature as the data for the highlight source
      map.getSource('highlight-feature').setData(hoveredFeature.geometry);
    } else {
      // if there is no feature under the mouse, reset things:
      map.getCanvas().style.cursor = 'default'; // make the cursor default

      // reset the highlight source to an empty featurecollection
      map.getSource('highlight-feature').setData({
        type: 'FeatureCollection',
        features: []
      });

      // reset the default message
      $('#feature-info').html(defaultText)
    }
  })




 });
