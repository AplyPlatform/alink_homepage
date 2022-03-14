
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

let currentLat, currentLng, currentAlt;

let isCommentAreaVisible = false;
let currentContentLat, currentContentLng;
let oldContentLat, oldContentLng;
let oldLat = -999, oldLng = -999, oldAlt = -999;
let currentContentArrays = [];

const popLabel = $('<span></span>');
const popContainer = $('<div id="place-label"></div>');

function initViewer() {            
    popContainer.append(popLabel);
    popContainer.hide();
    $("body").append(popContainer);

    $("#commentArea").hide();
    $("#replyButton").click(function() {
        writeComment();
    });

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

    AFRAME.registerComponent('raycaster-autorefresh', {
        init: function () {
          var el = this.el;
          this.el.addEventListener('model-loaded', function () {
            var cursorEl = el.querySelector('[raycaster]');
            cursorEl.components.raycaster.refreshObjects();
          });
        }
    });

    AFRAME.registerComponent('click-handler', {
        schema: {
            txt: {default:'default'}
            }, 
        init: function() {            
            this.el.addEventListener('click', clickListener);            
        }
    });

    getLocationData();
    hideLoader();
}

const getLocationData = function () {
        navigator.geolocation.getCurrentPosition(function (position) {            
                checkCurrentLocation(position);
                setTimeout("getLocationData()", 2000);
            },
            (err) => {
                //console.error('Error in retrieving position', err);
                setTimeout("getLocationData()", 2000);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 27000,
            }
        );
};


const checkCurrentLocation = function (position) {
    currentLat = position.coords.latitude;
    currentLng = position.coords.longitude;
    currentAlt = position.coords.altitude;

    if (oldLat == -999
        || Math.abs(currentLat - oldLat) > 0.0005
        || Math.abs(currentLng - oldLng) > 0.0005        
        ) {
        dynamicLoadPlaces();        
    }

    oldLat = currentLat;
    oldLng = currentLng;
    oldAlt = currentAlt;
};

const clickListener = function(ev, target) {      
    const el = ev.detail.intersection && ev.detail.intersection.object.el;

    if (el && el === ev.target) {        
        currentContentLat = ev.target.getAttribute('d_lat');
        currentContentLng = ev.target.getAttribute('d_lng');

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
};

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
        visiblePages: 5,
        first: '',
        prev : '',
        next : '',
        last : '',        
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

        let date = new Date(d.datetime * 1000).toISOString().split("T")[0];
        let time = new Date(d.datetime * 1000).toTimeString().split(" ")[0];
        let dtimeStr = date + " " + time;

        contentRow += "<div class='row'>"
            + "<div class='col-2 text-center'>"
            + imageContent
            + "</div>"
            + "<div class='col-2 text-left'><font size=1 color='#ccc'>"
            + dtimeStr
            + "</font></div><div class='col-8 text-left'>"
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

// getting places from REST APIs
function dynamicLoadPlaces() {
    let sns_id = getCookie("temp_sns_id");
    let skind = getCookie("dev_kind");
    let user_token = getCookie("user_token");
    let client_id = getCookie("user_clientid");

    var fd = new FormData();    
    fd.append('form_kind', "get");
    fd.append('lat', currentLat);
    fd.append('lng', currentLng);
    let alt = currentAlt;
    if (alt == null) alt = 0;    
    fd.append('alt', alt);
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

function renderPlaces(placesArray) {    
    if (!isSet(placesArray)) {
        $("#topText").text("No signals are loaded.");
        return;
    }
    
    currentContentArrays = placesArray;

    let count = 0;
    let scene = document.querySelector('a-scene');
    for (const placesLat in placesArray) {
        for (const placesLng in placesArray[placesLat]) {
            count += placesArray[placesLat][placesLng].length;

            d = placesArray[placesLat][placesLng][0];            

            let latitude = d.lat;
            let longitude = d.lng;
            
            let objetBox = document.createElement('a-box');
            objetBox.setAttribute('c_id', d.id);
            objetBox.setAttribute('d_lat', latitude);
            objetBox.setAttribute('d_lng', longitude);
            objetBox.setAttribute('rotation', '0 45 0');
            objetBox.setAttribute('position', '0 -5 0');
            objetBox.setAttribute('scale', '4.5 4.5 4.5');
            objetBox.setAttribute('src', 'https://duni.io/arink/cs/handler/handler.php?form_kind=image&filename=' + d.filename);

            // add place name
            let objet = document.createElement('a-entity');
            objet.setAttribute('c_id', d.id);
            objet.setAttribute('d_lat', latitude);
            objet.setAttribute('d_lng', longitude);
            objet.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);                
            objet.setAttribute('scale', '0.2 0.2 0.2');
            objet.setAttribute('gltf-model', '/cs/assets/dog.glb');
            objet.setAttribute('rotation', '0 90 0');
            objet.setAttribute('animation-mixer', '');
            objet.setAttribute("click-handler", "txt:image");
            objet.setAttribute("cursor", "rayOrigin:mouse");
            objet.setAttribute("smooth", "10");
            objet.setAttribute("smoothCount", "0.01");
            objet.setAttribute("smoothThreshold", "5");
                
            objet.addEventListener('loaded', () => {
                window.dispatchEvent(new CustomEvent('gps-entity-place-loaded', { detail: { component: this.el }}));
            });

            objet.appendChild(objetBox);
            scene.appendChild(objet);
        }
    }

    if (count == 1) $("#topText").text(count + " signal is loaded.");
    else $("#topText").text(count + " signals are loaded.");
}
