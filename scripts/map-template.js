export default `
<div>
    <style>
            html, body {
                margin: 0;
            }

            #map {
                height: 100%;
                width: 100%;
            }
    </style>
    
    <div id='map' class='map'>
    </div>


    <!-- load TomTom Maps Web SDK from CDN -->
    <link rel='stylesheet' type='text/css' href='https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.13.0/maps/maps.css'/>
    <script src='https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.13.0/maps/maps-web.min.js'></script>

    <script>
        // create the map
        tt.setProductInfo('TomTom Maps React Native Demo', '1.0');
        let map = tt.map({
            key: 'q2yukmABGuRvQD9NhkGAABCOYtIMoHFD',
            container: 'map',
            center: [77.3611061,  23.3184009],
            zoom: 14
        });

        // map the markers to the map from the array
        let markers = [];
        let marker = new tt.Marker().setLngLat([77.3621061,  23.3484009]).addTo(map);
        markers.push(marker);
        marker = new tt.Marker().setLngLat([77.3616061,  23.3154009]).addTo(map);
        markers.push(marker);
        marker = new tt.Marker().setLngLat([77.3631961,  23.3284009]).addTo(map);
        markers.push(marker);
        marker = new tt.Marker().setLngLat([77.3671061,  23.3189009]).addTo(map);
        markers.push(marker);


        // create the route
        let route = new tt.Route({
            key: 'q2yukmABGuRvQD9NhkGAABCOYtIMoHFD',
            traffic: false,
            locations: [
                {lat: 23.3184009, lng: 77.3611061},
                {lat: 23.3484009, lng: 77.3621061},
                {lat: 23.3154009, lng: 77.3616061},
                {lat: 23.3284009, lng: 77.3631961},
                {lat: 23.3189009, lng: 77.3671061},
            ]
        });

        // draw the route on the map
        route.addLayer(map, {
            addWaypoints: false,
            routeWidth: 5,
            routeColor: '#0072bb',
            routeOpacity: 0.8
        });
        

              

        

    </script>
</div>
`;
