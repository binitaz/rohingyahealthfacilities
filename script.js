// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map', {
  center: [21.161638442399923, 92.20201234936481],
  zoom: 10
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'default_public',
  username: 'binitaz'
});


// Initialze source data
var healthservicesSource = new carto.source.Dataset('who_healthservices_2017');

// Create style for the data
var healthservicesStyle = new carto.style.CartoCSS(`
  #layer {
  marker-width: 15;
  marker-fill: #2e2878;
  marker-fill-opacity: 0.86;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/production/binitaz/assets/20210507022449hospitalblue.png');
  marker-allow-overlap: true;
  marker-line-width: 2;
  marker-line-color: #ffffff;
  marker-line-opacity: 1;
}
`);

// Add style to the data
var healthservicesLayer = new carto.layer.Layer(healthservicesSource, healthservicesStyle, {
featureClickColumns: ["implementing_partner", "managing_authority", "operational", "site_info_facility_type", "clinical_services", "communicable_disease_services", "nutrition_services", "mnch_services"]
});

/*
 * Begin layer three
 */

// Initialze source data
var rohingyapopSource = new carto.source.Dataset('unhcrrohingyapop_mar2021');

// Create style for the data
var rohingyapopStyle = new carto.style.CartoCSS(`
  #layer {
  marker-width: ramp([total_individuals], range(15, 30), equal(5));
  marker-fill: #71735b;
  marker-fill-opacity: 0.79;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/triangle-18.svg');
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #000000;
  marker-line-opacity: 1;
}
`);
/*
 * Begin layer two
 */

// Initialze source data
var fireareaSource = new carto.source.Dataset('fire_affected_area');

// Create style for the data
var fireareaStyle = new carto.style.CartoCSS(`
  #layer {
  polygon-fill: #d93b28;
  polygon-opacity: 0.88;
}
#layer::outline {
  line-width: 1;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}
`);

// Add style to the data
var fireareaLayer = new carto.layer.Layer(fireareaSource, fireareaStyle);

// Add style to the data
var rohingyapopLayer = new carto.layer.Layer(rohingyapopSource, rohingyapopStyle, {
  featureClickColumns: ["total_individuals", "new_camp_name"]
});

/*
 * Begin layer four
 */

// Initialze source data
var rohingyacampsSource = new carto.source.Dataset('rohingyacamps');

// Create style for the data
var rohingyacampsStyle = new carto.style.CartoCSS(`
  #layer {
  polygon-fill: #cacfa7;
  polygon-opacity: 0.9;

}
#layer::outline {
  line-width: 0.5;
  line-color: #ffffff;
  line-opacity: 0.5;
}
`);

// Add style to the data
var rohingyacampsLayer = new carto.layer.Layer(rohingyacampsSource, rohingyacampsStyle);

// Add the data to the map as four layers. Order matters here--first one goes on the bottom
client.addLayers([rohingyacampsLayer, fireareaLayer, rohingyapopLayer, healthservicesLayer]);
client.getLeafletLayer().addTo(map);

var zoomButton = document.querySelector('.KB-button');
zoomButton.addEventListener('click', function () {
  // You could zoom anywhere you want in any event listener
  map.setView([21.195536,92.157140], 14);
});

var zoomButton = document.querySelector('.Nayapara-button');
zoomButton.addEventListener('click', function () {
  // You could zoom anywhere you want in any event listener
  map.setView([20.961840,92.258420], 14);
});

var zoomButton = document.querySelector('.HakimJamBagg-button');
zoomButton.addEventListener('click', function () {
  // You could zoom anywhere you want in any event listener
  map.setView([21.162762,92.145660], 15);
});

var zoomButton = document.querySelector('.Chakmarkul-button');
zoomButton.addEventListener('click', function () {
  // You could zoom anywhere you want in any event listener
  map.setView([21.132183,92.158502], 16);
});

var zoomButton = document.querySelector('.Unchiprang-button');
zoomButton.addEventListener('click', function () {
  // You could zoom anywhere you want in any event listener
  map.setView([21.087784,92.197073], 15);
});

var zoomButton = document.querySelector('.Shamlapur-button');
zoomButton.addEventListener('click', function () {
  // You could zoom anywhere you want in any event listener
  map.setView([21.078534,92.139866], 15);
});

var zoomButton = document.querySelector('.reset-button');
zoomButton.addEventListener('click', function () {
  // You could zoom anywhere you want in any event listener
  map.setView([21.161638442399923, 92.20201234936481], 10);
});

rohingyapopLayer.on('featureClicked', function (event) {
  // Create the HTML that will go in the popup. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var content = '<h2>' + event.data['new_camp_name'] + '</h2>';
  content += event.data['total_individuals'] + ' total refugees</div>';
  
  var popup = L.responsivePopup();
  popup.setContent(content);
  
  // Place the popup and open it
  popup.setLatLng(event.latLng);
  popup.openOn(map);
});

healthservicesLayer.on('featureClicked', function (event) {
  // Create the HTML that will go in the popup. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var content = '<h2>Implementing partner:</h2>'+ event.data['implementing_partner'];
  content += '<h2>Managing Authority:</h2>'+ event.data['managing_authority'];
  content += '<h2>Operational/Non-Operational:</h2>'+ event.data['operational'];
  content += '<h2>Facility type:</h2>'+ event.data['site_info_facility_type'];
  content += '<h2>Clinical services:</h2>'+ event.data['clinical_services'];
  content += '<h2>Communicable disease services:</h2>'+ event.data['communicable_disease_services'];
  content += '<h2>Nutrition services:</h2>'+ event.data['nutrition_services'];
  content += '<h2>MNCH services:</h2>'+ event.data['mnch_services'];
  
  var popup = L.responsivePopup();
  popup.setContent(content);
  
  // Place the popup and open it
  popup.setLatLng(event.latLng);
  popup.openOn(map);
});

$("a[href='#top']").click(function() {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  return false;
});
