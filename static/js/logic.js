//store the URL for the GeoJSON data - All quakes from last 30 days
let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

// Create Initial Map
let myMap = L.map("map", {
    center: [40.09, 3.23],
    zoom: 2
});

// Set up list to store data
feature_list = [];

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(earthquakeData) {
    earthquakeData.features.forEach(function(data){
        feature_list.push(data);
    });
    console.log(feature_list);
    feature_list.forEach(function(feature){
        addCircles(feature);
    })
    
});

// Add the tile layers
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(myMap)
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 19
});
let cycle = L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=cfa8580306864b06a147db3f4c0ba9cf', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 19
});
let trans = L.tileLayer('http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=cfa8580306864b06a147db3f4c0ba9cf', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 19
});

let baseMaps = {
    Street: street,
    Topography: topo,
    Cycle: cycle,
    Transport: trans
};

// Add tile layers to myMap
L.control.layers(baseMaps).addTo(myMap);

// Add Earthquake Circles
function addCircles(data){
    L.circle([data.geometry.coordinates[1], data.geometry.coordinates[0]], {
        radius: markerSize(data.properties.mag),
        fillColor: markerColor(data.geometry.coordinates[2]),
        weight: 0.5,
        opacity: 0.5,
        fillOpacity: 0.5}).bindPopup(`<h2>Location: ${data.properties.place}</h2><h3>Magnitude: ${data.properties.mag}</h3><h3> Depth: ${data.geometry.coordinates[2]}</h3>`).addTo(myMap);
};

// Determines marker size based on MAGNITUDE
function markerSize(magnitude) {
    return magnitude * 10000;
}

// Determines marker color based on DEPTH
function markerColor(depth) {
    if (depth > 90){
        return 'purple'
    }
    else if (depth > 60){
        return 'red'
    }
    else if (depth > 30){
        return 'orange'
    }
    else if (depth > 10){
        return 'yellow'
    }
    else{
        return 'green'
    }      
}

let legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

    let div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 30, 60, 90],
        labels = ['<p><strong>Depth(m)</strong></p>'],
        legendInfo = "";

        div.innerHTML +=
            labels
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '-' + grades[i + 1] + '<br>' : '+');
    }    

    return div;

};

// Add legend to map
legend.addTo(myMap);