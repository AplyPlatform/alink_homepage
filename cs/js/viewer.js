$(function() {
    let user_token = getCookie("user_token");
    if (!isSet(user_token)) {
        alert("로그인 후에 사용하실 수 있습니다.");
        location.href = "./index.html";
        return;
    }

    gIsMine = "no";

    initViewer();
});

let oldLat = -999, oldLng = -999, oldAlt = -999;
let currentEntities = Array();

function initViewer() {            
    showLoader();
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

    if(oldLat == -999) {
        oldLat = currentLat;
        oldLng = currentLng;
        oldAlt = currentAlt;        
        dynamicLoadPlaces();        
        return;
    }       

    if (Math.abs(currentLat - oldLat) > 0.00009 
        || Math.abs(currentLng - oldLng) > 0.0001) {            
            dynamicLoadPlaces();            
            oldLat = currentLat;
            oldLng = currentLng;
            oldAlt = currentAlt;
    }    
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
    showLoader();
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
        hideLoader();
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
                $('#commentArea').show();
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
        hideLoader();
        return;
    }    
    
    let scene = document.querySelector('a-scene');
    
    for(let i=(currentEntities.length - 1);i>=0;i--) {
        scene.removeChild(currentEntities[i]);
    }

    currentEntities = Array();

    let did = 0;
    placesArray.forEach((d) => {
        let latitude = d.lat;
        let longitude = d.lng;
        let count = d.cnt;                

        var wrapper= document.createElement('div');

        let moreMsg = '<font size=2>외에<br>'+ (count - 1) + '마리가 흔적을 남겼습니다</font>';
        if (count <= 1) {
            moreMsg = "";
        }

        let imagePath = 'https://duni.io/arink/cs/handler/handler.php?form_kind=image&filename=' + encodeURIComponent(d.filename);
        wrapper.innerHTML = '<div id="htmlElement_' + did + '"><div class="bubble text-center"><br>'
                        + '<div class="imgcontainer">'                        
                        +   '<div class="circleborder"><img src="' + imagePath + '" border=0 width="90px" height="90px" class="content_img">'
                        +       '<div class="edit_photo"><div class="circleborder_small"><img src="/cs/assets/heart.png" width="15px" class="content_img"></div></div>'
                        +   '</div>'
                        + '</div>'
                        + '<br><br><font size=3 color=black><b>' + d.nickname + '</b></font>'
                        + moreMsg
                        + '<br><font size=4><b>...</b></font>'
                        + '</div><div>&nbsp;&nbsp;</div></div>';
        
        var objetBox = document.createElement('a-entity');
        objetBox.setAttribute('d_lat', latitude);
        objetBox.setAttribute('d_lng', longitude);
        objetBox.setAttribute('d_count', count);        
        objetBox.setAttribute('htmlembed', '');        
        objetBox.setAttribute('look-at', '[gps-camera]');
        objetBox.setAttribute('scale', '2 2 2');
        objetBox.setAttribute('animation-mixer', '');
        objetBox.setAttribute("click-handler", "txt:image");
        objetBox.setAttribute("cursor", "rayOrigin:mouse");
        objetBox.setAttribute("raycaster-autorefresh", "");
        objetBox.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);           
        
        objetBox.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded', { detail: { component: this.el }}));
        });        
              
        scene.appendChild(objetBox);        
        objetBox.appendChild(wrapper);
        currentEntities.push(objetBox);
        did++;

        if (did == 1) $("#topText").text(did + " signal is loaded.");
        else $("#topText").text(did + " signals are loaded.");
    });

    hideLoader();
}
