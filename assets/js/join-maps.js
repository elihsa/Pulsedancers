async function initJoinMaps(){const city=document.getElementById('join_city');if(city){new google.maps.places.Autocomplete(city,{types:['(cities)']});}}window.initJoinMaps=initJoinMaps;
