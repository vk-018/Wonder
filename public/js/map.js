
  //First we’ll initialize the map and set its view to our chosen geographical coordinates and a zoom level:
  //all mouse and touch interactions on the map are enabled, and it has zoom and attribution controls.
  var map = L.map('map').setView([coordinates.lat, coordinates.lon], 13);

/*
L.map('map')	Creates a Leaflet map inside the HTML element with id="map".
.setView([...], zoom)	Centers the map at the given latitude/longitude and sets the initial zoom level.
var map = ...	Stores the resulting Leaflet map object in a variable named map.
*/

//we’ll add a tile layer to add to our map, in this case it’s a OpenStreetMap tile layer. Creating a tile layer usually involves setting the URL template for the tile images, 
// the attribution text, and the maximum zoom level of the layer.

////This line adds a tile layer to your Leaflet map, which is the visual base layer (the map graphics you see — roads, terrain, etc.). Leaflet itself doesn't provide map tiles —
//  it just renders them using services like OpenStreetMap (OSM).
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {    //z is zoom level ,x and y are respective coordinates
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'   //Required credit text to comply with OpenStreetMap's usage terms. (copyright)
}).addTo(map);      //Actually adds this tile layer to the Leaflet map object you previously created.


//adding a marker to the map
var marker = L.marker([coordinates.lat, coordinates.lon]).addTo(map);

//adding a popup
console.log("hit");
console.log(coordinates);
if(coordinates.lat===28.6448 && coordinates.lon===77.216721){
    marker.bindPopup("<b>Hello !</b><br>This is the Default Address").openPopup();
}
else{
marker.bindPopup("<b>Hello !</b><br>This is Your Place").openPopup();
}



    

