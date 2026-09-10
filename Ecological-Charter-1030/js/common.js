// Shared boilerplate used by every DSD-Ecological-Charter map page.
// Loaded once per page via <script src="js/common.js"> after leaflet.js
// and before the page's own inline <script>. Everything here is a plain
// function/class declaration (no side effects at load time), so it is
// safe to include early — actual instantiation happens from each page's
// own script once `map` exists.

var highlightLayer;
function highlightFeature(e) {
    highlightLayer = e.target;

    if (e.target.feature.geometry.type === 'LineString' || e.target.feature.geometry.type === 'MultiLineString') {
        highlightLayer.setStyle({
            color: '#ffff00',
        });
    } else {
        highlightLayer.setStyle({
            fillColor: '#ffff00',
            fillOpacity: 1
        });
    }
    highlightLayer.openPopup();
}

// remove popup's row if "visible-with-data"
function removeEmptyRowsFromPopupContent(content, feature) {
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    var rows = tempDiv.querySelectorAll('tr');
    for (var i = 0; i < rows.length; i++) {
        var td = rows[i].querySelector('td.visible-with-data');
        var key = td ? td.id : '';
        if (td && td.classList.contains('visible-with-data') && feature.properties[key] == null) {
            rows[i].parentNode.removeChild(rows[i]);
        }
    }
    return tempDiv.innerHTML;
}
// add class to format popup if it contains media
function addClassToPopupIfMedia(content, popup) {
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    if (tempDiv.querySelector('td img')) {
        popup._contentNode.classList.add('media');
        // Delay to force the redraw
        setTimeout(function () {
            popup.update();
        }, 10);
    } else {
        popup._contentNode.classList.remove('media');
    }
}

// Bottom-left "info" panel (page title). Call once map exists:
//   initTitleControl(map, '<h2>Page title</h2>');
function initTitleControl(map, htmlText) {
    var title = new L.Control({ 'position': 'bottomleft' });
    title.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };
    title.update = function () {
        this._div.innerHTML = htmlText;
    };
    title.addTo(map);
    return title;
}

// Top-left "i" hover panel (page abstract/description). Call once map exists:
//   initAbstractControl(map, 'Description text...');
function initAbstractControl(map, htmlText) {
    var abstractControl = new L.Control({ 'position': 'topleft' });
    abstractControl.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'leaflet-control abstract');
        this._div.id = 'abstract';
        this._div.addEventListener('mouseenter', function () { abstractControl.show(); });
        this._div.addEventListener('mouseleave', function () { abstractControl.hide(); });
        this.hide();
        return this._div;
    };
    abstractControl.hide = function () {
        this._div.classList.remove('abstractUncollapsed');
        this._div.classList.add('abstract');
        this._div.innerHTML = 'i';
    };
    abstractControl.show = function () {
        this._div.classList.remove('abstract');
        this._div.classList.add('abstractUncollapsed');
        this._div.innerHTML = htmlText;
    };
    abstractControl.addTo(map);
    return abstractControl;
}

// The 3 standard basemaps (OpenStreetMap / Google Terrain / Google Satellite),
// with Google Terrain added to the map by default. Call once map exists:
//   var basemaps = initBasemaps(map);
//   var layer_OpenStreetMap_0 = basemaps.osm;
//   var layer_GoogleTerrain_1 = basemaps.terrain;
//   var layer_GoogleSatellite_0 = basemaps.satellite;
function initBasemaps(map) {
    map.createPane('pane_OpenStreetMap_0');
    map.getPane('pane_OpenStreetMap_0').style.zIndex = 400;
    var layer_OpenStreetMap_0 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        pane: 'pane_OpenStreetMap_0',
        opacity: 1.0,
        attribution: '',
        minZoom: 1,
        maxZoom: 28,
        minNativeZoom: 0,
        maxNativeZoom: 19
    });

    map.createPane('pane_GoogleTerrain_1');
    map.getPane('pane_GoogleTerrain_1').style.zIndex = 401;
    var layer_GoogleTerrain_1 = L.tileLayer('http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}', {
        pane: 'pane_GoogleTerrain_1',
        opacity: 1.0,
        attribution: '',
        minZoom: 1,
        maxZoom: 28,
        minNativeZoom: 0,
        maxNativeZoom: 18
    });
    map.addLayer(layer_GoogleTerrain_1);

    map.createPane('pane_GoogleSatellite_0');
    map.getPane('pane_GoogleSatellite_0').style.zIndex = 399;
    var layer_GoogleSatellite_0 = L.tileLayer('https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
        pane: 'pane_GoogleSatellite_0',
        opacity: 1.0,
        attribution: '',
        minZoom: 1,
        maxZoom: 28,
        minNativeZoom: 0,
        maxNativeZoom: 18
    });

    return {
        osm: layer_OpenStreetMap_0,
        terrain: layer_GoogleTerrain_1,
        satellite: layer_GoogleSatellite_0
    };
}

// Photon (Nominatim/BAN) location search control + its collapse toggle button.
// Call once map exists: initSearchControl(map);
function initSearchControl(map) {
    const url = {
        "Nominatim": "https://nominatim.openstreetmap.org/search?format=geojson&addressdetails=1&",
        "BAN": "https://api-adresse.data.gouv.fr/search/?"
    }
    var photonControl = L.control.photon({
        url: url["Nominatim"],
        feedbackLabel: '',
        position: 'topleft',
        includePosition: true,
        initial: true,
        // resultsHandler: myHandler,
    }).addTo(map);
    photonControl._container.childNodes[0].style.borderRadius = "10px"
    // Create a variable to store the geoJSON data
    var x = null;
    // Create a variable to store the marker
    var marker = null;
    // Add an event listener to the Photon control to create a marker from the returned geoJSON data
    var z = null;
    photonControl.on('selected', function (e) {
        console.log(photonControl.search.resultsContainer);
        if (x != null) {
            map.removeLayer(obj3.marker);
            map.removeLayer(x);
        }
        obj2.gcd = e.choice;
        x = L.geoJSON(obj2.gcd).addTo(map);
        var label = typeof obj2.gcd.properties.label === 'undefined' ? obj2.gcd.properties.display_name : obj2.gcd.properties.label;
        obj3.marker = L.marker(x.getLayers()[0].getLatLng()).bindPopup(label).addTo(map);
        map.setView(x.getLayers()[0].getLatLng(), 17);
        z = typeof e.choice.properties.label === 'undefined' ? e.choice.properties.display_name : e.choice.properties.label;
        console.log(e);
        e.target.input.value = z;
    });
    var search = document.getElementsByClassName("leaflet-photon leaflet-control")[0];
    search.classList.add("leaflet-control-search")
    search.style.display = "flex";
    search.style.backgroundColor = "rgba(255,255,255,0.5)"

    // Créer le nouvel élément bouton
    var button = document.createElement("div");
    button.id = "gcd-button-control";
    button.className = "gcd-gl-btn fa fa-search search-button";

    // Ajouter le bouton à l'élément parent
    search.insertBefore(button, search.firstChild);
    var last = search.lastChild;
    last.style.display = "none";
    button.addEventListener("click", function (e) {
        if (last.style.display === "none") {
            last.style.display = "block";
        } else {
            last.style.display = "none";
        }
    });
    return photonControl;
}

// "Home" button (top-left) resetting the map to the standard Schaerbeek view.
// Instantiate once map exists: new HomeControl().addTo(map);
var HomeControl = L.Control.extend({
    options: { position: 'topleft' },
    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        var link = L.DomUtil.create('a', 'leaflet-control-home fa fa-home', container);
        link.href = '#';
        link.title = 'Vue initiale';
        link.setAttribute('role', 'button');
        link.setAttribute('aria-label', 'Vue initiale');
        L.DomEvent.on(link, 'click', function (e) {
            L.DomEvent.stop(e);
            map.fitBounds([[50.84242805691727, 4.35343370855978], [50.88164566987217, 4.4308537948872715]]);
        });
        return container;
    }
});

// "menu principal" button (top-left) returning to the hub index.html.
let MyControlClass = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        var div = L.DomUtil.create('div', 'leaflet-bar my-control');

        var myButton = L.DomUtil.create('button', 'my-button-class', div);
        myButton.innerHTML = 'menu principal';
        L.DomEvent.on(myButton, 'click', function () {
            window.open("../index.html");
            window.close();
        }, this);
        return div;
    },

    onRemove: function (map) {
    }
});

// Bottom-left 1030 logo watermark.
L.Control.Watermark = L.Control.extend({
    onAdd: function (map) {
        var img = L.DomUtil.create('img');
        img.src = 'css/images/schaerbeek1030_logo.png';
        img.style.width = '75px';

        return img;
    },
    onRemove: function (map) {
        // Nothing to do here
    }
});
L.control.watermark = function (opts) { return new L.Control.Watermark(opts); }

// Adds the standard "menu principal" button and 1030 watermark to the map.
// Call once near the end of each page's script: initFooterControls(map);
function initFooterControls(map) {
    let myControl = new MyControlClass().addTo(map);
    L.control.watermark({ position: 'bottomleft' }).addTo(map);
}

// Bottom-left mail feedback button (requires easy-button.css/js). Call once
// map exists: initFeedbackButton(map, 'Feedback: <nom de la carte>');
function initFeedbackButton(map, subject) {
    L.easyButton('fa-envelope', function (btn, map) {
        window.location.href = "mailto:info@1030.be?subject=" + encodeURIComponent(subject);
    }).setPosition('bottomleft').addTo(map); // topleft, topright, bottomleft, bottomright
}

// Resizes the layer-control list to account for the toggle icon, and
// collapses it by default on small screens. Self-registering — just
// including this file wires it up, no call needed.
document.addEventListener("DOMContentLoaded", function () {
    // set new Layers List height which considers toggle icon
    function newLayersListHeight() {
        var layerScrollbarElement = document.querySelector('.leaflet-control-layers-scrollbar');
        if (layerScrollbarElement) {
            var layersListElement = document.querySelector('.leaflet-control-layers-list');
            var originalHeight = layersListElement.style.height
                || window.getComputedStyle(layersListElement).height;
            var newHeight = parseFloat(originalHeight) - 50;
            layersListElement.style.height = newHeight + 'px';
        }
    }
    var isLayersListExpanded = true;
    var controlLayersElement = document.querySelector('.leaflet-control-layers');
    var toggleLayerControl = document.querySelector('.leaflet-control-layers-toggle');
    // toggle Collapsed/Expanded and apply new Layers List height
    toggleLayerControl.addEventListener('click', function () {
        if (isLayersListExpanded) {
            controlLayersElement.classList.remove('leaflet-control-layers-expanded');
        } else {
            controlLayersElement.classList.add('leaflet-control-layers-expanded');
        }
        isLayersListExpanded = !isLayersListExpanded;
        newLayersListHeight()
    });
    // apply new Layers List height if toggle layerstree
    if (controlLayersElement) {
        controlLayersElement.addEventListener('click', function (event) {
            var toggleLayerHeaderPointer = event.target.closest('.leaflet-layerstree-header-pointer span');
            if (toggleLayerHeaderPointer) {
                newLayersListHeight();
            }
        });
    }
    // Collapsed/Expanded at Start to apply new height
    setTimeout(function () {
        toggleLayerControl.click();
    }, 10);
    setTimeout(function () {
        toggleLayerControl.click();
    }, 10);
    // Collapsed touch/small screen
    var isSmallScreen = window.innerWidth < 650;
    if (isSmallScreen) {
        setTimeout(function () {
            controlLayersElement.classList.remove('leaflet-control-layers-expanded');
            isLayersListExpanded = !isLayersListExpanded;
        }, 500);
    }
});
