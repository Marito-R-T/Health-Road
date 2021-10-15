mapboxgl.accessToken = 'pk.eyJ1Ijoib2RyYTEyMjAiLCJhIjoiY2t1N2xmN243MDF2MzJvcDN0M2lpdDA1ZSJ9.8i8Nib_WvoHPO06k7LypaA';
var map = new mapboxgl.Map({
   container: 'map',
   style: 'mapbox://styles/mapbox/streets-v11',
   center:[ -91.51832317540874,14.834277919227247],
   zoom: 13
});
map.addControl(new mapboxgl.GeolocateControl({
   positionOptions: {
      enableHighAccuracy: true
   },
   trackUserLocation: true,
   showUserHeading: true
}));
const marker = new mapboxgl.Marker({
   draggable: true
})
   .setLngLat([ -91.51832317540874,14.834277919227247])
   .addTo(map);

function onDragEnd() {
   const lngLat = marker.getLngLat();
   coordinates.style.display = 'block';
   coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
}

marker.on('dragend', onDragEnd);