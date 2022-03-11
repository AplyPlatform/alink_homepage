
$(function() {
    initViewer();        
});

let isCommentAreaVisible = false;
let currentContentId = -1;
let currentContentImage = "";
let currentMemo = "";
let currentLat, currentLng, currentAlt;
let oldLat = -999, oldLng = -999, oldAlt = -999;

function initViewer() {    
    let user_token = getCookie("user_token");
    if (!isSet(user_token)) {
        alert("로그인 후 사용하실 수 있습니다.");
        location.href = "./index.html";
        return;
    }

    $("#commentArea").hide();
    $("#replyButton").click(function() {
        writeComment();
    });

    $("#closeBtn").click(function () {
        $("#commentArea").hide();
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
    ev.stopPropagation();
    ev.preventDefault();

    currentMemo = ev.target.getAttribute('memo');
    currentContentId = ev.target.getAttribute('id');
    currentContentImage = ev.target.getAttribute('content_image');
    
    const el = ev.detail.intersection && ev.detail.intersection.object.el;

    if (el && el === ev.target) {
        const label = document.createElement('span');
        const container = document.createElement('div');
        container.setAttribute('id', 'place-label');
        label.innerText = currentMemo;
        container.appendChild(label);
        document.body.appendChild(container);
        
        setTimeout(() => {
            container.parentElement.removeChild(container);
        }, 1500);

        if (isCommentAreaVisible == true) {
            isCommentAreaVisible = false;
            $('#commentArea').hide();
        }

        setTimeout(() => {
            getReplyContent();
        }, 0);

    }
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

function showComments(comments) {
    if (comments && comments.length > 0) {
        
    }   
    
    isCommentAreaVisible = true;
    
    $('#commentReplyArea').empty();
    
    let contentRow = "<div class='row'><div class='col-12 text-center'>"
                        + "<img src='https://duni.io/arink/cs/images/" + currentContentImage + "' border=0 width='150px'>"
                        + "<br>" + currentMemo
                        + "<br><br></div></div>";
    
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
}

function writeComment() {
    let comment = $("#commentInput").val();
    if (comment == "") {
        alert("내용을 입력해 주5");
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
        $("#commentInput").val("");
        setTimeout(() => {
            getReplyContent();
        }, 0);
    }).fail(function()  {
        alert("Sorry. Server unavailable. ");
        hideLoader();
    });
}

function getReplyContent() {
    if (currentContentId < 0) return;

    let sns_id = getCookie("temp_sns_id");
    let skind = getCookie("dev_kind");
    let user_token = getCookie("user_token");
    let client_id = getCookie("user_clientid");

    $('#commentArea').show();
    showLoader();

    var fd = new FormData();
    fd.append('user_id', 1324);
    fd.append('form_kind', "comment");
    fd.append('c_id', currentContentId);
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
        showComments(data.data);
        hideLoader();
    }).fail(function()  {
        alert("Sorry. Server unavailable. ");
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
        // todo:
        // redirection
        renderPlaces(data.data); 
    }).fail(function()  {
        alert("Sorry. Server unavailable. ");
    });
};

function renderPlaces(places) {    
    if (!isSet(places)) {
        $("#topText").text("No signals are loaded.");
        return;
    }

    if (places.length == 1) $("#topText").text(places.length + " signal is loaded.");
    else $("#topText").text(places.length + " signals are loaded.");

    let scene = document.querySelector('a-scene');
    let assets = document.querySelector('a-assets');

    places.forEach((d) => {
        let latitude = d.lat;
        let longitude = d.lng;
        
        let objCanvas = document.createElement('canvas');
        objCanvas.setAttribute('width',"500px");
        objCanvas.setAttribute('height', '500px');
        objCanvas.setAttribute('id', d.id + "_box_canvas");

        let imgContext = objCanvas.getContext("2d");
        let img = new Image();
        img.onload = function()
        {
            imgContext.drawImage(img,0,0,200,200);
            imgContext.moveTo(30,96);
            imgContext.lineTo(70,66);
            imgContext.lineTo(103,76);
            imgContext.lineTo(170,15);
            imgContext.stroke();
        };
        img.src = "https://duni.io/arink/cs/images/" + d.filename;
        assets.appendChild(objCanvas);

        let objetBox = document.createElement('a-box');
        objetBox.setAttribute('id', d.id + "_box");         
        objetBox.setAttribute('rotation', '0 45 0');        
        objetBox.setAttribute('position', '0 -4 0');
        objetBox.setAttribute('scale', '3.5 3.5 3.5');
        objetBox.setAttribute('color', '#ffffff');
        objetBox.setAttribute('material', 'src:#' + d.id + "_box_canvas");
        objetBox.setAttribute("start", "");
        objetBox.setAttribute("content_image", d.filename);

        // add place name
        let objet = document.createElement('a-entity');
        objet.setAttribute('id', d.id);
        objet.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);                
        objet.setAttribute('scale', '0.2 0.2 0.2');
        objet.setAttribute('gltf-model', '/cs/assets/dog.glb');
        objet.setAttribute('memo', d.memo);
        objet.setAttribute('rotation', '0 90 0');
        objet.setAttribute('animation-mixer', '');
        objet.setAttribute('content_image', d.filename);
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
    });    
}
