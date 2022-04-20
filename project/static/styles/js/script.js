/* eslint-disable no-undef */
/**
 * contextmenu
 */

const moonCord = {
  lat: 40.7412684,
  lng: -74.0284178,
};

        const map = L.map('mapid').setView([43.769, 11.255], 18);
        var OSM_basemap =L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        {attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a>'
        });
        var wmsLayers = {
        'Mappa Alberi Comune Firenze': L.tileLayer.wms("http://tms.comune.fi.it/tiles/service/wms?",{
        layers: "sivep:alberi_pubblici_ComuneFI",
        format: 'image/png', transparent: true,
        }).addTo(map)
        };
        L.control.layers({OSM_basemap},wmsLayers).addTo(map);

// ------------------------------------------
// custom icon and popup
function onEachFeature(feature, layer) {
  layer.bindPopup(feature.properties.ID);
}

const contextmenuItems = [
  {
    text: "🗺 Mostra le coordinate dell'albero",
    callback: showCoordinates,
  },
  
  {
    text: "🗺 Mostra le specifiche dell'albero",
    callback: showCoordinates,
  },
  {
    text: "🚀 Segnala anomalia sull'albero",
    callback: centerMap,
  },
  {
    text: "🏠 Adotta albero",
    callback: backToHome,
  },
  {
    text: "Zoom in",
    callback: zoomIn,
  },
  {
    text: "Zoom out",
    callback: zoomOut,
  },
];

// global variable to store the coordinates
let latlngObj = {
  lat: 0,
  lng: 0,
};

// callbacks function
function showCoordinates(e) {
  console.log(latlngObj);
  const coordinatesLabel = document.querySelector(".coordinates-label");
  coordinatesLabel.style.display = "block";
  coordinatesLabel.innerText = `Lat: ${latlngObj.lat} Lng: ${latlngObj.lng}`;
  hideMenu();
}

function centerMap(e) {
  map.flyTo([moonCord.lat, moonCord.lng], 17, { animate: true, duration: 10 });
  setTimeout(() => {
    marker.openPopup();
    showCoordinatesLabel.innerHTML =
      "<a href='https://en.wikipedia.org/wiki/Statue_of_Frank_Sinatra' target='_blank'>Open wiki: Statue of Frank Sinatra</a>";
  }, 10000);
  hideMenu();
}

function backToHome(e) {
  var db = openDatabase('Alberi.db', '1.0', 2 * 1024 * 1024);
  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM features WHERE coordinates[0]= e.lat AND coordinates[1]=e.lng', [], function (tx, results) {
      var len = results.rows.length, i;
      for (i = 0; i < len; i++) {
        alert(results.rows.item(i).text);
      }
    });
});
  marker.closePopup();
  removeTextFromLabel();
  hideMenu();
}

function zoomIn() {
  map.zoomIn();
  hideMenu();
}

function zoomOut() {
  map.zoomOut();
  hideMenu();
}

// hide context menu
function hideMenu() {
  const ul = document.querySelector(".context-menu");
  ul.removeAttribute("style");
  ul.classList.remove("is-open");
}

// create context menu
function createMenu() {
  const menu = document.createElement("ul");
  menu.classList.add("context-menu");
  menu.setAttribute("data-contextmenu", "0");
  contextmenuItems.forEach((item) => {
    const li = document.createElement("li");
    li.innerText = item.text;
    li.addEventListener("click", item.callback);
    menu.appendChild(li);
  });

  return menu;
}

// append context menu to the body
document.body.appendChild(createMenu());

// coordinate label
const showCoordinatesLabel = document.createElement("p");
showCoordinatesLabel.classList.add("coordinates-label");
removeTextFromLabel();

document.body.appendChild(showCoordinatesLabel);

function removeTextFromLabel() {
  //showCoordinatesLabel.textContent = "right click on the map";
}

// Add context menu to the map
var menu = document.querySelector("#map");
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();

  // show context menu
  show(e);
});

function show(e) {
  const ul = document.querySelector("ul");
  ul.style.display = "block";
  ul.style.left = `${e.pageX}px`;
  ul.style.top = `${e.pageY}px`;
  ul.classList.add("is-open");

  ul.focus();

  const point = L.point(e.pageX, e.pageY);
  const coordinates = map.containerPointToLatLng(point);

  latlngObj = { ...latlngObj, ...coordinates };

  e.preventDefault();
}

// ------------------------------------------

window.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("wheel", hideMenu);

  ["zoomstart", "resize", "click", "move"].forEach((eventType) => {
    map.on(eventType, hideMenu);
  });
});

function onLocationFound(e) {
  var radius = e.accuracy;

  L.marker(e.latlng).addTo(map)
      .bindPopup("You are within " + radius + " meters from this point").openPopup();

  L.marker(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

map.locate({setView: true, maxZoom: 16});

