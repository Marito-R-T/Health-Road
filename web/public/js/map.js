mapboxgl.accessToken = 'pk.eyJ1Ijoib2RyYTEyMjAiLCJhIjoiY2t1N2xmN243MDF2MzJvcDN0M2lpdDA1ZSJ9.8i8Nib_WvoHPO06k7LypaA';

var longitude_number = -91.51832317540874;
var latitude_number = 14.834277919227247;

if (document.getElementById('longitude')) {
   if (document.getElementById('longitude').value) {
      longitude_number = parseFloat(document.getElementById('longitude').value);
      latitude_number = parseFloat(document.getElementById('latitude').value);
   }
}





const map = new mapboxgl.Map({
   container: 'map',
   style: 'mapbox://styles/mapbox/streets-v11',
   center: [longitude_number, latitude_number],
   zoom: 14
});



const geocoder = new MapboxGeocoder({
   mapboxgl: mapboxgl,
   accessToken: mapboxgl.accessToken,
   marker: false
})
geocoder.on('result', e => {
   const marker = new mapboxgl.Marker({
      draggable: true,
   })
      .setLngLat(e.result.center)
      .addTo(map)
   marker.on('dragend', e => {
      const lngLat = marker.getLngLat();
      var longitude = document.getElementById('longitude');
      var latitude = document.getElementById('latitude');
      var direction = document.getElementById('address');
      longitude.value = lngLat.lng;
      latitude.value = lngLat.lat;
      var url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
         + lngLat.lng + ', ' + lngLat.lat
         + '.json?types=poi&access_token=' + 'pk.eyJ1Ijoib2RyYTEyMjAiLCJhIjoiY2t1N2xmN243MDF2MzJvcDN0M2lpdDA1ZSJ9.8i8Nib_WvoHPO06k7LypaA';
      var text = "";
      let request = new XMLHttpRequest();
      request.open("GET", url, true);
      request.onload = () => { const obj = JSON.parse(request.responseText); direction.value = obj.features[0].place_name; }
      request.send();



   })
})
map.addControl(geocoder);
const marker1 = new mapboxgl.Marker()
.setLngLat([longitude_number, latitude_number])
.addTo(map);

