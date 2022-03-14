
$(function() {
    let user_token = getCookie("user_token");
    if (!isSet(user_token)) {
        alert("로그인 후에 사용하실 수 있습니다.");
        location.href = "./index.html";
        return;
    }

    showLoader();
    initViewer();        
});

let currentIndex = 0;

let isCommentAreaVisible = false;
let currentContentLat, currentContentLng;
let oldContentLat, oldContentLng;
let currentContentArrays = [];
let currentReplyIndex = 0;

const popLabel = $('<span></span>');
const popContainer = $('<div id="place-label"></div>');

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

    $("commentReplyMore").click(function() {
        currentReplyIndex += 10;
        getComments(currentContentId, currentReplyIndex);
    });

    initMap();
    dynamicLoadPlaces();    
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function setCurrentContent() {
    let contentsArrays = currentContentArrays[currentContentLat][currentContentLng];

    $('#pagination').twbsPagination('destroy');
    $('#pagination').twbsPagination({
        totalPages: contentsArrays.length,
        visiblePages: 3,
        first: '최신기록',
        prev : '',
        next : '',
        last : '첫기록',        
        onPageClick: function (event, page) {
            contentsArrays = currentContentArrays[currentContentLat][currentContentLng];
            let content = contentsArrays[page - 1];
            showContent(content);
        }
    });

    $('#pagination').twbsPagination('show', 1);
}

function showContent(content) {
    $('#currentImage').attr("src", "https://duni.io/arink/cs/images/" + content.filename);
        
    let date = new Date(content.datetime * 1000).toISOString().split("T")[0];    
    const time = new Date(content.datetime * 1000).toTimeString().split(" ")[0];    
    $('#currentDate').html("<font size=1>" + date + ' ' + time + "</font>");
    $('#currentMemo').html("<b>" + content.memo + "</b>");
    $('#commentArea').show();

    popLabel.text(content.memo);
    popContainer.show();
    
    setTimeout(() => {
        popContainer.hide();
    }, 1500);

    currentContentId = content.id;    
    getComments(content.id, 0);
}


function getComments(c_id, start) {    
    showLoader();

    let sns_id = getCookie("temp_sns_id");
    let skind = getCookie("dev_kind");
    let user_token = getCookie("user_token");
    let client_id = getCookie("user_clientid");        

    var fd = new FormData();
    fd.append('form_kind', "comment");
    fd.append('c_id', c_id);
    fd.append('sns_id', sns_id);
    fd.append('sns_kind', skind);
    fd.append('user_token', user_token);
    fd.append('client_id', client_id);
    fd.append('start', start);

    $.ajax({
        type: 'POST',
        url: 'https://duni.io/arink/cs/handler/handler.php',
        data: fd,
        cache: false,
        processData: false,
        contentType: false                                                    
    }).done(function(data) {
        showComments(data.data, start);
        hideLoader();
    }).fail(function()  {
        showAlert("일시적인 오류가 발생하였습니다. 잠시후 다시 시도해 주세요.");
        hideLoader();
    });
}

function showComments(comments, start) {    
    isCommentAreaVisible = true;

    if (start == 0) $('#commentReplyArea').empty();
    
    if (!comments || comments.length <= 0) {       
        $('#commentReplyMore').hide(); 
        return;
    }

    currentReplyIndex = 0;
    
    let contentRow = "";    
    comments.forEach((d) => {
        let imageContent = "";
        if ("image" in d && isSet(d.image)) {
            imageContent = "<img src='" + d.image + "' border='0' width='16px' height='16px'>";
        }
        else {
            imageContent = "<img src='/cs/assets/" + getRandomInt(1,10) + ".png' border='0' width='16px' height='16px'>";
        }

        contentRow += "<div class='row'>"
            + "<div class='col-2 text-center'>"
            + imageContent
            + "</div><div class='col-10 text-left'>"
            + d.comment
            + "</div>"            
            + "</div><div class='row'><hr size='1' width='90%' color='#aaa'></div>";        
    });

    $('#commentReplyArea').append(contentRow);

    if (comments.length >= 10) {
        $('#commentReplyMore').show();
    }
    else {
        $('#commentReplyMore').hide();
    }
}

function writeComment() {
    let comment = $("#commentInput").val();
    if (comment == "") {
        showAlert("내용을 입력해 주5");
        return;
    }

    showLoader();

    let sns_id = getCookie("temp_sns_id");
    let skind = getCookie("dev_kind");
    let user_token = getCookie("user_token");
    let temp_image = getCookie("temp_image");
    let client_id = getCookie("user_clientid");

    let fd = new FormData();    
    fd.append('form_kind', 'write');
    fd.append('c_id', currentContentId);
    fd.append('c_image', temp_image);
    fd.append('comment', comment);
    fd.append('sns_id', sns_id);
    fd.append('sns_kind', skind);
    fd.append('user_token', user_token);
    fd.append('client_id', client_id);
    $.ajax({
        type: 'POST',
        url: 'https://duni.io/arink/cs/handler/handler.php',
        data: fd,
        cache: false,
        processData: false,
        contentType: false                                                    
    }).done(function(data) {
        setTimeout(() => {
            getComments(currentContentId);
        }, 0);
    }).fail(function()  {
        showAlert("일시적인 오류가 발생하였습니다. 잠시후 다시 시도해 주세요.");
        hideLoader();
    });
}

function dynamicLoadPlaces() {
    let sns_id = getCookie("temp_sns_id");
    let skind = getCookie("dev_kind");
    let user_token = getCookie("user_token");
    let client_id = getCookie("user_clientid");

    var fd = new FormData();    
    fd.append('form_kind', "get");
    fd.append('is_mine', 1);
    fd.append('sns_id', sns_id);
    fd.append('sns_kind', skind);
    fd.append('user_token', user_token);
    fd.append('client_id', client_id);
    $.ajax({
        type: 'POST',
        url: 'https://duni.io/arink/cs/handler/handler.php',
        data: fd,
        cache: false,
        processData: false,
        contentType: false                                                    
    }).done(function(data) {        
        renderPlaces(data.data); 
    }).fail(function()  {
        showAlert("일시적인 오류가 발생하였습니다. 잠시후 다시 시도해 주세요.");
    });
};

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
    let ii = f.get('mlat');
    if (!isSet(ii)) {
       return;     
    }

    currentContentLat = f.get('mlat');
    currentContentLng = f.get('mlng');

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
            setCurrentContent();
        }, 0);
    }
}


function createNewIconFor2DMap(item) {

    var pos_icon = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([item.lng * 1, item.lat * 1])),
        name: "lat: " + item.lat + ", lng: " + item.lng + ", alt: " + item.alt,
        mindex: currentIndex++,
        mlat : item.lat,        
        mlng : item.lng,
    });

    return pos_icon;
}


function renderPlaces(placesArray) {
    if (!isSet(placesArray)) {
        $("#topText").text("No signals are loaded.");
        hideLoader();
        return;
    }
    
    currentContentArrays = placesArray;

    let count = 0;    
    let latitude = -999;
    let longitude = -999;

    for (const placesLat in placesArray) {
        for (const placesLng in placesArray[placesLat]) {            
            let size = placesArray[placesLat][placesLng].length;
            count += size;

            latitude = placesLat;
            longitude = placesLng;

            for (let i=(size-1);i>=0;i--) {
                let d = placesArray[placesLat][placesLng][i];                
                
                let icon = createNewIconFor2DMap({ lat: placesLat, lng: placesLng, alt: d.alt });
                if (isSet(g_vector_2D_map_for_dog)) {
                    g_vector_2D_map_for_dog.addFeature(icon);
                }
            }            
        }
    }
    
    let npos = ol.proj.fromLonLat([longitude * 1, latitude * 1]);
    g_view_2D_map.setCenter(npos);
    
    if (count == 1) $("#topText").text(count + " signal is loaded.");
    else $("#topText").text(count + " signals are loaded.");
    hideLoader();
}
