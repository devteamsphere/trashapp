module.exports = `
<!DOCTYPE html>
<html>

<head>
  <title>Taxi cars dispatcher</title>
  <meta charset="UTF-8">
  <link rel='stylesheet' type='text/css' href='https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.6.0/maps/maps.css'>
  <!--<script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.6.0/maps/maps-web.min.js"></script>-->
  <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.6.0/services/services-web.min.js"></script>


  <!-- From Version 5 -->
  <link rel='stylesheet' type='text/css'
    href='https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/5.38.0/maps/css-styles/traffic-incidents.css'>
  </link>
  <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/5.69.1/maps/maps-web.min.js"></script>


  <style>
    body {
      margin: 0;
    }

    #map {
      height: 100vh;
      width: 100vw;
    }

    #submit-button {
      background: #df1b12;
      padding: 10px;
      margin-top: 10px;
      width: 100%;
      color: white;
      font-weight: bold;
      transition: background-color .15s ease-in-out;
      text-transform: uppercase;
      border: none;
      outline: none;
    }

    #submit-button:hover {
      cursor: pointer;
      background: #b1110e;
    }

    #labels-container {
      font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;
      position: fixed;
      top: 10px;
      right: 10px;
      width: 400px;
      padding: 10px;
      margin: 10px;
      background-color: white;
      box-shadow: rgba(0, 0, 0, 0.45) 2px 2px 2px 0px;
    }

    #labels-container label {
      line-height: 2;
      font-size: 1.2em;
      font-weight: bold;
    }

    #labels-container #route-labels div {
      border-left: 6px solid;
      padding-left: 5px;
      margin-top: 3px;
    }

    #route-labels div:hover {
      cursor: pointer;
      box-shadow: 0px 2px #888888;
    }

    #modal {
      display: none;
      position: fixed;
      z-index: 1100;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.5);
    }

    #modal-content {
      background-color: lightgray;
      color: #555;
      font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;
      font-weight: bold;
      text-align: center;
      margin: 15% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 20%;
    }
  </style>
</head>

<body>
  <div id="map"></div>
  <div id="labels-container">
    <label>Find the taxi that will arrive fastest</label>
    <div id="route-labels"></div>
    <input type="button" id="submit-button" value="Submit">
  </div>
  <div id="modal">
    <div id="modal-content"></div>
  </div>
  <script>
    const apiKey = 'q2yukmABGuRvQD9NhkGAABCOYtIMoHFD';

    const passengerInitCoordinates = [75.5324774, 30.3660445];

    let passengerMarker;

    let taxiPassengerBatchCoordinates = [];
    let taxiConfig;
    const zoomLevel = 18;

    let routes = [];
    let bestRouteIndex;

    const routeLabelsDiv = document.getElementById('route-labels');

    const routeWeight = 9;
    const routeBackgroundWeight = 12;
    const fastestRouteColor = '#65A7A9';
    const grayedOutDivColor = '#979797';

    const map = tt.map({
      key: apiKey,
      container: 'map',
      language: 'english',
      center: passengerInitCoordinates,
      zoom: zoomLevel,
    });

    var trafficFlowConfig = {
      key: apiKey,
      theme: {
        style: 'relative-delay',
        source: 'vector'
      },
      refresh: 3000
    };

    var trafficIncidentsConfig = {
      key: apiKey,
      incidentTiles: {
        style: 'tomtom://vector/1/s2'
      },
      incidentDetails: {
        style: 's2'
      }
    };

    map.on('load', function () {
      map.addTier(new tt.TrafficIncidentTier(trafficIncidentsConfig));
      // map.addTier(new tt.TrafficFlowTilesTier(trafficFlowConfig));
    })

    map.addControl(new tt.FullscreenControl());
    map.addControl(new tt.NavigationControl());

    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');

    function setDefaultTaxiConfig() {
      taxiConfig = [
        createTaxi('CAR #1', '#006967', [75.5323774, 30.3650445], 'img/cab1.png'),
        createTaxi('CAR #2', '#EC619F', [75.5325774, 30.3460445], 'img/cab2.png'),
        createTaxi('CAR #3', '#002C5E', [75.5324974, 30.3668445], 'img/cab3.png'),
        createTaxi('CAR #4', '#F9B023', [75.532374, 30.3664445], 'img/cab4.png')
      ];
    }

    function createTaxi(name, color, coordinates, iconFilePath, iconWidth = 55, iconHeight = 55) {
      return {
        name: name,
        color: color,
        icon: "<img src=" + iconFilePath + " style='width: " + iconWidth + "px; height: " + iconHeight + "px;'>",
        coordinates: coordinates
      };
    }

    function updateTaxiBatchLocations(passengerCoordinates) {
      taxiPassengerBatchCoordinates = [];
      taxiConfig.forEach(taxi => {
        taxiPassengerBatchCoordinates.push(taxi.coordinates + ':' + passengerCoordinates);
      });
    }

    function humanReadableTimeFormat(time) {
      const hrs = Math.floor(time / 3600);
      const mins = Math.floor((time % 3600) / 60);
      const secs = time % 60;
      let formattedString = '';
      if (hrs > 0) {
        formattedString += hrs + ':' + (mins < 10 ? '0' : '');
      }
      formattedString += mins + ':' + (secs < 10 ? '0' : '');
      formattedString += secs;
      return formattedString;
    }

    function metersToKilometers(distance) {
      distance = distance / 1000;
      return distance.toFixed(1);
    }

    function convertToPoint(lat, long) {
      return {
        point: {
          latitude: lat,
          longitude: long
        }
      };
    }

    function routeOnMouseOverAnimation(route) {
      map.moveLayer(route[0]);
      map.moveLayer(route[1]);
    }

    function bringBestRouteToFront() {
      map.moveLayer(routes[bestRouteIndex][0]);
      map.moveLayer(routes[bestRouteIndex][1]);
    }

    function buildOriginsParameter() {
      const origins = [];
      taxiConfig.forEach(function (taxi) {
        origins.push(convertToPoint(taxi.coordinates[1], taxi.coordinates[0]));
      });
      return origins;
    }

    function buildDestinationsParameter() {
      return [convertToPoint(passengerMarker.getLngLat().lat, passengerMarker.getLngLat().lng)];
    }

    function modifyFastestRouteColor(travelTimeInSecondsArray) {
      const sortedTab = travelTimeInSecondsArray.slice();
      sortedTab.sort(function (a, b) { return a - b });
      bestRouteIndex = travelTimeInSecondsArray.indexOf(sortedTab[0]);
      taxiConfig[bestRouteIndex].color = fastestRouteColor;
    }

    function displayModal() {
      modalContent.innerText = 'Dispatch car number ' + String(bestRouteIndex + 1);
      modal.style.display = 'block';
    }

    function animateRouteOnDivHover(e) {
      routeOnMouseOverAnimation(routes[e.target.id]);
    }

    function updateRouteLegend(travelTimeInSecondsArray, lengthInMetersArray, trafficDelayInSecondsArray) {
      let div;
      routeLabelsDiv.innerText = '';

      taxiConfig.forEach(function (child, index) {
        div = document.createElement('div');
        div.id = index;
        div.style.borderLeftColor = child.color;
        if (index !== bestRouteIndex) {
          div.style.color = grayedOutDivColor;
        }
        div.colorHex = child.color;
        div.innerText = child.name
          + ' drive time:' + humanReadableTimeFormat(travelTimeInSecondsArray[index])
          + ', distance:' + metersToKilometers(lengthInMetersArray[index])
          + 'km, ' + ((trafficDelayInSecondsArray[index] === 0) ? 'no traffic delay' : 'traffic delay:' + humanReadableTimeFormat(trafficDelayInSecondsArray[index]));
        div.addEventListener('mouseover', animateRouteOnDivHover);
        div.addEventListener('mouseout', bringBestRouteToFront);
        routeLabelsDiv.appendChild(div);
      });
    }

    function drawAllRoutes() {
      tt.services.calculateRoute({
        batchMode: 'sync',
        key: apiKey,
        batchItems: [
          { locations: taxiPassengerBatchCoordinates[0] },
          { locations: taxiPassengerBatchCoordinates[1] },
          { locations: taxiPassengerBatchCoordinates[2] },
          { locations: taxiPassengerBatchCoordinates[3] }
        ]
      })
        .then(function (results) {
          results.batchItems.forEach(function (singleRoute, index) {
            const routeGeoJson = singleRoute.toGeoJson();
            const route = [];
            const route_background_layer_id = 'route_background_' + index;
            const route_layer_id = 'route_' + index;

            map.addLayer(buildStyle(route_background_layer_id, routeGeoJson, 'black', routeBackgroundWeight))
              .addLayer(buildStyle(route_layer_id, routeGeoJson, taxiConfig[index].color, routeWeight));

            route[0] = route_background_layer_id;
            route[1] = route_layer_id;
            routes[index] = route;

            if (index === bestRouteIndex) {
              const bounds = new tt.LngLatBounds();
              routeGeoJson.features[0].geometry.coordinates.forEach(function (point) {
                bounds.extend(tt.LngLat.convert(point));
              });
              map.fitBounds(bounds, { padding: 150 });
            }

            map.on("mouseenter", route_layer_id, function () {
              map.moveLayer(route_background_layer_id);
              map.moveLayer(route_layer_id);
            });

            map.on("mouseleave", route_layer_id, function () {
              bringBestRouteToFront();
            });
          });
          bringBestRouteToFront();
        });
    }

    function buildStyle(id, data, color, width) {
      return {
        'id': id,
        'type': 'line',
        'source': {
          'type': 'geojson',
          'data': data
        },
        'paint': {
          'line-color': color,
          'line-width': width
        },
        'layout': {
          'line-cap': 'round',
          'line-join': 'round'
        }
      }
    }

    function clear() {
      routes.forEach(function (child) {
        map.removeLayer(child[0]);
        map.removeLayer(child[1]);
        map.removeSource(child[0]);
        map.removeSource(child[1]);
      });
      routes = [];
      setDefaultTaxiConfig();
      passengerMarker.togglePopup();
    }

    function processMatrixResponse(result) {
      const travelTimeInSecondsArray = [];
      const lengthInMetersArray = [];
      const trafficDelayInSecondsArray = [];
      result.matrix.forEach(function (child) {
        travelTimeInSecondsArray.push(child[0].response.routeSummary.travelTimeInSeconds);
        lengthInMetersArray.push(child[0].response.routeSummary.lengthInMeters);
        trafficDelayInSecondsArray.push(child[0].response.routeSummary.trafficDelayInSeconds);
      });
      modifyFastestRouteColor(travelTimeInSecondsArray);
      updateRouteLegend(travelTimeInSecondsArray, lengthInMetersArray, trafficDelayInSecondsArray);
      drawAllRoutes();
      displayModal();
    }

    function callMatrix() {
      const origins = buildOriginsParameter();
      const destinations = buildDestinationsParameter();
      tt.services.matrixRouting({
        key: apiKey,
        origins: origins,
        destinations: destinations,
        traffic: true
      }).then(processMatrixResponse);
    }

    function submitButtonHandler() {
      clear();
      callMatrix();
    }

    function drawPassengerMarkerOnMap(geoResponse) {
      if (geoResponse && geoResponse.addresses
        && geoResponse.addresses[0].address.freeformAddress) {
        passengerMarker.remove();
        passengerMarker = createPassengerMarker(geoResponse.addresses[0].position,
          new tt.Popup({ offset: 35 }).setHTML(geoResponse.addresses[0].address.freeformAddress));
        passengerMarker.togglePopup();
      }
    }

    function createPassengerMarker(markerCoordinates, popup) {
      const passengerMarkerElement = document.createElement('div');
      passengerMarkerElement.innerHTML = "<img src='img/man-waving-arm_32.png' style='width: 30px; height: 30px';>";
      return new tt.Marker({ element: passengerMarkerElement }).setLngLat(markerCoordinates).setPopup(popup).addTo(map);
    }

    setDefaultTaxiConfig();
    updateTaxiBatchLocations(passengerInitCoordinates);

    tt.setProductInfo('Taxi dispatcher example application', '1.00');

    map.addControl(new tt.NavigationControl(), 'top-left');
    passengerMarker = createPassengerMarker(passengerInitCoordinates,
      new tt.Popup({ offset: 35 }).setHTML("Click anywhere on the map to change passenger location."));
    passengerMarker.togglePopup();
    taxiConfig.forEach(function (taxi) {
      const carMarkerElement = document.createElement('div');
      carMarkerElement.innerHTML = taxi.icon;
      new tt.Marker({ element: carMarkerElement, offset: [0, 27] }).setLngLat(taxi.coordinates).addTo(map);
    });

    map.on('click', function (event) {
      const position = event.lngLat;
      tt.services.reverseGeocode({
        key: apiKey,
        position: position
      })
        .then(function (results) {
          drawPassengerMarkerOnMap(results);
          updateTaxiBatchLocations(passengerMarker.getLngLat().toArray());
        });
    });

    modal.addEventListener('click', function () {
      modal.style.display = 'none';
    });
    document.getElementById('submit-button').addEventListener('click', submitButtonHandler);
  </script>
</body>

</html>
`;

// export default `
// <div>
//     <style>
//             html, body {
//                 margin: 0;
//             }

//             #map {
//                 height: 100%;
//                 width: 100%;
//             }
//     </style>

//     <div id='map' class='map'></div>

//     <!-- load TomTom Maps Web SDK from CDN -->
//     <link rel='stylesheet' type='text/css' href='https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.13.0/maps/maps.css'/>
//     <script src='https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.13.0/maps/maps-web.min.js'></script>

//     <script>

//     // display map

//     // create map object
//     var map = tt.map({
//         key: 'DhEtBJzDVqTrCGLRuW6bHAJzyiDsVnNg',
//         container: 'map',

//     });

//     // set map's zoom
//     map.setZoom(18);
//     // add marker to the map
//     var marker = new tt.Marker().setLngLat([75.5324771, 30.3660431]).addTo(map);
//     // add popup to the marker
//     var popupOffsets = {
//         top: [0, 0],
//         bottom: [0, -70],

//     }
//     var popup = new tt.Popup({offset: popupOffsets}).setHTML("<b>My Location</b>");
//     marker.setPopup(popup).togglePopup();
//     // set map center to the marker's location
//     map.setCenter(marker.getLngLat());

//     // map.setStyle = ('tomtom://vector/1/basic-night');

//     // show a mark on the destination
//     var destination = new tt.Marker().setLngLat([75.5354871, 30.3660931]).addTo(map);
//     var popupOffsets = {
//         top: [0, 0],
//         bottom: [0, -70],

//     }

//     var popup = new tt.Popup({offset: popupOffsets}).setHTML("<b>Destination</b>");
//     destination.setPopup(popup).togglePopup();

//     const routeLine = new tt.RouteLine({
//         style: { width: 6 },
//         fitBounds: true,
//         interactive: false,
//       }).addTo(map);

//       tt.services
//         .calculateRoute({
//           key: 'DhEtBJzDVqTrCGLRuW6bHAJzyiDsVnNg',
//           locations: [
//             { lat: 30.3660431 , lng: 75.5324771 },
//             { lat: 30.3660931, lng: 75.5354871 },
//           ],
//         })
//         .then(result => {
//           const { geometry } = result.routes[0];
//           routeLine.setRoutes({ type: 'FeatureCollection', features: [{ type: 'Feature', geometry }] });
//         });

//     </script>
// </div>
// `;
