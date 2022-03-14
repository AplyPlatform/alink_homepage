$(function() {
    let user_token = getCookie("user_token");
    if (!isSet(user_token)) {
        alert("로그인 후에 사용하실 수 있습니다.");
        location.href = "./index.html";
        return;
    }

    gIsMine = "no";

    showLoader();
    initViewer();        
});

let oldLat = -999, oldLng = -999, oldAlt = -999;

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

    $("#commentReplyMore").click(function() {
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
        renderPlacesToAR(data.data); 
    }).fail(function()  {
        showAlert("일시적인 오류가 발생하였습니다. 잠시후 다시 시도해 주세요.");
    });
}

const clickListener = function(ev, target) {      
    const el = ev.detail.intersection && ev.detail.intersection.object.el;

    if (el && el === ev.target) {        
        let currentContentLat = ev.target.getAttribute('d_lat');
        let currentContentLng = ev.target.getAttribute('d_lng');
        let currentContentCount = ev.target.getAttribute('d_count');

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
};


function renderPlacesToAR(placesArray) {    
    if (!isSet(placesArray) || placesArray.length == 0) {
        $("#topText").text("No signals are loaded.");
        return;
    }    
    
    let scene = document.querySelector('a-scene');
    placesArray.forEach((d) => {
        let latitude = d.lat;
        let longitude = d.lng;
        let count = d.cnt;
        
        
        let objetText = document.createElement('a-text');
        objetText.setAttribute('d_lat', latitude);
        objetText.setAttribute('d_lng', longitude);        
        objetText.setAttribute('d_count', count);
        objetText.setAttribute('value', count + '');
        objetText.setAttribute('look-at', '[gps-camera]');
        objetText.setAttribute('color', 'white');
        objetText.setAttribute('position', '0 5 0');
        objetText.setAttribute('scale', '4 4 4');
        
        let objetBox = document.createElement('a-box');
        objetBox.setAttribute('d_lat', latitude);
        objetBox.setAttribute('d_lng', longitude);
        objetBox.setAttribute('d_count', count);
        objetBox.setAttribute('look-at', '[gps-camera]');
        objetBox.setAttribute('position', '0 -5 0');
        objetBox.setAttribute('scale', '4.5 4.5 4.5');
        objetBox.setAttribute('src', 'https://duni.io/arink/cs/handler/handler.php?form_kind=image&filename=' + d.filename);        

        let objet = document.createElement('a-entity');            
        objet.setAttribute('d_lat', latitude);
        objet.setAttribute('d_lng', longitude);
        objet.setAttribute('d_count', count);
        objet.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);                
        objet.setAttribute('scale', '0.2 0.2 0.2');
        objet.setAttribute('gltf-model', '/cs/assets/dog.glb');
        objet.setAttribute('look-at', '[gps-camera]');
        objet.setAttribute('animation-mixer', '');
        objet.setAttribute("click-handler", "txt:image");
        objet.setAttribute("cursor", "rayOrigin:mouse");
        objet.setAttribute("smooth", "10");
        objet.setAttribute("smoothCount", "0.01");
        objet.setAttribute("smoothThreshold", "5");
                    
        objet.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded', { detail: { component: this.el }}));
        });        

        objet.appendChild(objetText);
        objet.appendChild(objetBox);        
        scene.appendChild(objet);
    });

    if (placesArray.length == 1) $("#topText").text(placesArray.length + " signal is loaded.");
    else $("#topText").text(placesArray.length + " signals are loaded.");
}
