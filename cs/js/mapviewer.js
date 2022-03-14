"use strict";

$(function() {
    let user_token = getCookie("user_token");
    if (!isSet(user_token)) {
        alert("로그인 후에 사용하실 수 있습니다.");
        location.href = "./index.html";
        return;
    }

    gIsMine = "yes";

    showLoader();
    initViewer();        
});


function initViewer() {            
    popContainer.append(popLabel);
    popContainer.hide();
    $("body").append(popContainer);

    $("#commentArea").hide();

    $("#closeBtn").click(function () {
        $("#commentArea").hide();
        oldContentLat = -999;
        oldContentLng = -999;
        isCommentAreaVisible = false;
    });

    $("#commentReplyMore").click(function() {
        currentReplyIndex += 10;
        getComments(currentContentId, currentReplyIndex);
    });

    initMap();
}


function dynamicLoadPlaces() {
    let sns_id = getCookie("temp_sns_id");
    let skind = getCookie("dev_kind");
    let user_token = getCookie("user_token");
    let client_id = getCookie("user_clientid");
  
    let fd = new FormData();    
    fd.append('form_kind', "get");
    fd.append('is_mine', gIsMine);
    fd.append('sns_id', sns_id);
    fd.append('sns_kind', skind);
    fd.append('user_token', user_token);
    fd.append('client_id', client_id);
    fd.append('lat', currentLat);
    fd.append('lng', currentLng);
    fd.append('alt', currentAlt);
    $.ajax({
        type: 'POST',
        url: 'https://duni.io/arink/cs/handler/handler.php',
        data: fd,
        cache: false,
        processData: false,
        contentType: false                                                    
    }).done(function(data) {        
        renderPlacesToMap(data.data); 
    }).fail(function()  {
        showAlert("일시적인 오류가 발생하였습니다. 잠시후 다시 시도해 주세요.");
    });
}

let g_view_2D_map;
let g_vector_2D_map_for_dog;

function initMap() {
    let dpoint = ol.proj.fromLonLat([126.5203904, 33.3616837]);
    g_view_2D_map = new ol.View({
        center: dpoint,
        zoom: 7
    });

    let bingLayer = new ol.layer.Tile({
        visible: true,
        preload: Infinity,
        source: new ol.source.OSM()
                //new ol.source.Stamen({ layer: 'toner', })
    });

    let overviewMapControl = new ol.control.OverviewMap({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })],
        collapsed: true
    });

    g_vector_2D_map_for_dog = new ol.source.Vector();
    let clusterCompanySource = new ol.source.Cluster({
        distance: 40,
        source: g_vector_2D_map_for_dog,
        geometryFunction: function (feature) {
            var geom = feature.getGeometry();
            return geom.getType() == 'Point' ? geom : null;
        },
    });

    let styleCacheForCompany = {};
    let g_layer_2D_map_for_company = new ol.layer.Vector({
        source: clusterCompanySource,
        zIndex: 20,
        style: function (feature) {
            if (!feature) return;

            let size = feature.get('features').length;
            let radius;
            size == 1 ? radius = 8 : radius = 10 + (size * 0.1);
            let style = styleCacheForCompany[size];
            if (!style) {
                if (size == 1) {
                    style = [new ol.style.Style({
                        image: new ol.style.Icon({
                            src: '/cs/assets/map_icon.png',
                            scale: 0.07,
                            opacity: 0.8,
                            fill: new ol.style.Fill({ color: '#FFF' }),
                            stroke: new ol.style.Stroke({ color: '#45cdba', width: 2 }),
                        })
                    })];
                }
                else {
                    style = [new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: radius,
                            opacity: 0.7,
                            fill: new ol.style.Fill({ color: '#FFF' }),
                            stroke: new ol.style.Stroke({ color: '#45cdba', width: 2 })
                        }),
                        text: new ol.style.Text({
                            font: radius + 'px Roboto',
                            text: size.toString(),
                            fill: new ol.style.Fill({ color: '#000' })
                        })
                    })];
                }

                styleCacheForCompany[size] = style
            }
            return style;
        },
    });

    let vMap = new ol.Map({
        controls: ol.control.defaults().extend([
            overviewMapControl
        ]),
        target: 'historyMap',
        layers: [
            bingLayer,  g_layer_2D_map_for_company
        ],
        loadTilesWhileAnimating: true,
        view: g_view_2D_map
    });

    vMap.on('click', function (evt) {
        var feature = vMap.forEachFeatureAtPixel(evt.pixel, function (feature) { return feature; });
        processMapClick(vMap, feature);
    });
}

function isCluster(feature) {
    if (!feature || !feature.get('features')) {
        return false;
    }

    return feature.get('features').length >= 1;
}

function processMapClick(map, feature) {
    if (!isCluster(feature)) {
        map.getView().animate({
            zoom: map.getView().getZoom() + 1,
            duration: 250
        })
        return;
    }

    var features = feature.get('features');
    var count = features.length;
    if (count <= 0 || (count > 1 && (map.getView().getZoom() < 18))) {
        map.getView().animate({
            zoom: map.getView().getZoom() + 1,
            duration: 250
        })
        return;
    }

    displayMapFeature(features[0]);
}

function displayMapFeature(f) {
    let currentContentLat = f.get('mlat');
    if (!isSet(currentContentLat)) {
       return;     
    }

    let currentContentLng = f.get('mlng');
    let currentContentCount = f.get('mcount');

    if (isCommentAreaVisible == true) {
        isCommentAreaVisible = false;
        $('#commentArea').hide();
        oldContentLat = -999;
        oldContentLng = -999;
    }
    else {
        if (currentContentLat == oldContentLat &&
            currentContentLng == oldContentLng) {
            return;
        }

        oldContentLat = currentContentLat;
        oldContentLng = currentContentLng;
        setTimeout(() => {
            setCurrentContent(currentContentLat, currentContentLng, currentContentCount);
        }, 0);
    }
}


function createNewIconFor2DMap(item) {
    let pos_icon = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([item.lng * 1, item.lat * 1])),
        name: "lat: " + item.lat + ", lng: " + item.lng + ", alt: " + item.alt,
        mlat : item.lat,        
        mlng : item.lng,
        mcount : item.mcount
    });

    return pos_icon;
}


function renderPlacesToMap(placesArray) {
    if (!isSet(placesArray) || placesArray.length <= 0) {
        $("#topText").text("No signals are loaded.");
        hideLoader();
        return;
    }
    
    let latitude = -999;
    let longitude = -999;

    placesArray.forEach((d) => {
        latitude = d.lat;
        longitude = d.lng;        

        let icon = createNewIconFor2DMap({ lat: latitude, lng: longitude, alt: 0, mcount: d.cnt });
        if (isSet(g_vector_2D_map_for_dog)) {
            g_vector_2D_map_for_dog.addFeature(icon);
        }
    });
    
    let npos = ol.proj.fromLonLat([longitude * 1, latitude * 1]);
    g_view_2D_map.setCenter(npos);
    
    if (placesArray.length == 1) $("#topText").text(placesArray.length + " signal is loaded.");
    else $("#topText").text(placesArray.length + " signals are loaded.");
    hideLoader();
}
