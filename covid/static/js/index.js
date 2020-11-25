var mymap = L.map('mapid').setView([56, -4], 7);

// Set up map using leaflet
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    // Select map tile set
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiMjMwNTUzOWIiLCJhIjoiY2toeGxtNnQ2MDFqMzJ4cWE0cGI4NnFtMCJ9.PoNK_6KKiyGaLrJwYFRqXA'
}).addTo(mymap);

// Load data for administrative boundaries into map
$.getJSON("static/js/sco_admin_bounds.json",function(data){
L.geoJson(data).addTo(mymap);
});