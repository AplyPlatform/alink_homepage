/* Copyright 2022 APLY Inc. All rights reserved. */

'use strict';

var currentPostId = 0;
var latestPostId = 0;
var jobIds = ["latest"]; // 은혜작가 최신글 또는 일상?
var commentArrayData = [];
var pageContents = [];
var curContent;
var currentCommentCount = 0;
var hideTimeout = -1, showTimeout = -1;
var currrentPage;

$(function() {
    currentPostId = getQueryVariable("mid");
    if (!isSet(currentPostId)) {
        location.href = "https://aplx.aply.biz";
        return;
    }

    document.title = "정은혜 작가와 소통하기: " + currentPostId + " | APLX";
    eventOC_IN();    
    window.onbeforeunload = function (e) {    
        eventOC_OUT();
        return undefined;   
    };
    updateMindSet();    

    setTimeout(function(){
        // This hides the address bar:
        window.scrollTo(0, 1);
    }, 0);
});  

function updateMindSet() {
    jobIds.push(currentPostId);

    var mindFileName = currentPostId + ".mind";
    $('#front_image').attr("src", "./assets/ex/targets/" + currentPostId + ".jpg");

    setARContent(mindFileName);

    const setButtons = () => {
        mSel("#paintandquest-preview-button").addEventListener('click', function (evt) {
            mSel("#paintandquest-preview-button").setAttribute("visible", false);
            mSel("#paintandquest-video-mp4").play();
        });        

        mSel("#bird1_button").addEventListener('click', function (evt) {       
            setFirstPage();
        });

        mSel("#bird2_button").addEventListener('click', function (evt) {       
            setSecondPage();
        });

        mSel("#like_button_over").addEventListener('click', function (evt) {
            likeMessage();
        });

        mSel("#like_button_intro").addEventListener('click', function (evt) {
            likeMessage();
        });

        mSel("#write_comment_button").addEventListener('click', function (evt) {
            mSel("#bottom_border").style.display = 'none';
            mSel("#top_border").style.display = 'none';
            $("#area_comment_writer").show();
        });

        mSel("#closeButton").addEventListener('click', function(evt) {
            mSel("#bottom_border").style.display = 'block';
            mSel("#top_border").style.display = 'block';
            $("#area_comment_writer").hide();
        });

        mSel("#replyButton").addEventListener('click', function(evt) {            
            writeMessage();            
        });

    };

    const sceneEl = document.querySelector('a-scene');
    sceneEl.addEventListener('targetFound', event => {      
        mSel("#top_border").style.display = 'block';
        mSel("#bottom_border").style.display = 'block';        
        setFirstPage();
    });
        
    sceneEl.addEventListener('targetLost', event => {
        mSel("#top_border").style.display = 'none';
        mSel("#bottom_border").style.display = 'none';
    });

    setButtons();
    showComment();
    get_messages(); 
}

function setARContent(mindFileName) {
    var strContent = '<a-scene loading-screen="dotsColor: red; backgroundColor: black" mindar-image="imageTargetSrc: ./assets/ex/targets/' + mindFileName + '; showStats: false; uiScanning: #example-scanning-overlay; filterMinCF:0.0001; filterBeta: 0.001;" embedded color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false"> \
      <a-assets> \
        <img id="hearticon_before" src="./assets/ex/icon_heart1@3x.png" /> \
        <img id="hearticon" src="./assets/icon_heart.png" /> \
        <img id="line_plane" src="./assets/ex/plane.png" /> \
        <img id="hearticon_before" src="./assets/ex/icon_heart1@3x.png" /> \
        <img id="selfi_image" src="./assets/ex/selfie@3x.png" /> \
        <img id="selfidraw_image" src="./assets/ex/selfimage@3x.png" /> \
        <img id="paintandquest-preview" src="./assets/play.png" /> \
        <video id="paintandquest-video-mp4" autoplay="false" loop="true" src="./assets/ex/inv.mp4"></video> \
      </a-assets> \
      \
      <a-camera position="0 0 0" look-controls="enabled: false" cursor="fuse: false; rayOrigin: mouse;" raycaster="far: 10000; objects: .clickable"></a-camera> \
      \
      <a-entity id="card-object-target" mindar-image-target="targetIndex: 0"> \
        <a-entity visible=false id="portfolio-panel-over" position="0 0 0"> \
            <a-image id="over_image" position="0 0 0.02" width="1.02" height="1.02"></a-image> \
            <a-image id="aplane_over" src="#line_plane" position="0 0 0.01" width="1" height="0.5"></a-image> \
            <a-troika-text id="comment_a2_over" max-width="0.6" line-height="1.5" position="-0.05 -0.33 0.1" value="41234123" color="#333" align="left" font="../objet/assets/PoorStory-Regular.ttf" font-size="0.04"></a-troika-text> \
            <a-image class="clickable" id="like_button_over" src="#hearticon_before" position="0.27 -0.39 0.01" alpha-test="0.5" width="0.1" height="0.1" animation="property: scale; to: 1.1 1.1 1.1; dir: alternate; loop: true"></a-image> \
        </a-entity> \
        <a-entity visible=false id="portfolio-panel-intro" position="0 0 0"> \
            <a-image src="#line_plane" position="0 0 -0.01" width="0.7" height="1"></a-image> \
            <a-image id="main_image_area" position="0 0.1 0" width="0.62" height="0.76"></a-image> \
            <a-troika-text id="comment_a2_intro" max-width="0.41" line-height="1.5" position="-0.05 -0.33 0.1" value="41234123" color="#333" align="left" font="../objet/assets/PoorStory-Regular.ttf" font-size="0.03"></a-troika-text> \
            <a-image class="clickable" id="like_button_intro" src="#hearticon_before" position="0.27 -0.39 0.01" alpha-test="0.5" width="0.1" height="0.1" animation="property: scale; to: 1.1 1.1 1.1; dir: alternate; loop: true"></a-image> \
            \
            <a-entity id="portfolio-item0"> \
                <a-video id="paintandquest-video-link" webkit-playsinline playsinline width="0.65" height="0.43" position="0 0.1 0"></a-video> \
                <a-image id="paintandquest-preview-button" class="clickable" src="#paintandquest-preview" alpha-test="0.5" position="0 0.1 0" width="0.65" height="0.43"></a-image> \
            </a-entity> \
        </a-entity> \
      </a-entity> \
    </a-scene>';

    $('#example-container').append(strContent);    
}

function playSound(id) {
    try {
        if (id == 1)
            new Audio("./assets/ex/button.wav").play();
        else
            new Audio("./assets/ex/like.wav").play();
    }
    catch(e) {

    }
}

function setFirstPageAssets() {

    mSel("#portfolio-panel-over").setAttribute("visible", true);
    mSel("#portfolio-panel-intro").setAttribute("visible", false);

    var curContent = pageContents[currentPostId];
    commentArrayData = curContent.comments;    

    mSel("#comment_a1").innerHTML = curContent.title;
    mSel("#comment_a2_over").setAttribute("value", curContent.content);
    mSel("#over_image").setAttribute("src", curContent.filename);

    var ratio = curContent.height / curContent.width;
    mSel("#over_image").setAttribute("height", ratio + 0.02);
    mSel("#over_image").setAttribute("width", 1.02);

    var a_planePos = (ratio / 2) + (ratio / 7);    
    mSel("#aplane_over").setAttribute("position", "0 -" + a_planePos + " 0");
    mSel("#aplane_over").setAttribute("height", ratio / 6);

    var a_likePos = a_planePos;
    mSel("#like_button_over").setAttribute("position", "0.36 -" + a_likePos + " 0.01");    

    var a_commPos = a_likePos;
    mSel("#comment_a2_over").setAttribute("position", "-0.1 -" + a_commPos + " 0.01");    

    playSound(1);
    setLikeButtonStatus(currentPostId);    
    
}


function setSecondPageAssets() {
    mSel("#portfolio-panel-over").setAttribute("visible", false);
    mSel("#portfolio-panel-intro").setAttribute("visible", true);

    var curContent = pageContents[latestPostId];
    commentArrayData = curContent.comments;

    mSel("#comment_a1").innerHTML = curContent.title;
    mSel("#comment_a2_intro").setAttribute("value", curContent.content);
    
    if (curContent.filename != "") {
        if (getFileExt(curContent.filename).toLowerCase() == "mp4") {                
            mSel("#paintandquest-video-mp4").setAttribute("src", "");
            mSel("#paintandquest-video-link").setAttribute("src", "");
            mSel("#paintandquest-video-mp4").setAttribute("src", curContent.filename);                
            mSel("#paintandquest-video-link").setAttribute("src", "#paintandquest-video-mp4");
            mSel("#main_image_area").setAttribute("visible", false);                
            mSel("#portfolio-item0").setAttribute("visible", true);
        }
        else {
            mSel("#main_image_area").setAttribute("src", curContent.filename);
            mSel("#main_image_area").setAttribute("visible", true);
            mSel("#portfolio-item0").setAttribute("visible", false);
        }
    }

    mSel("#paintandquest-video-mp4").currentTime = 0;
    mSel("#paintandquest-video-mp4").pause();
    mSel("#paintandquest-preview-button").setAttribute("visible", true);

    setLikeButtonStatus(latestPostId);
}

function setFirstPage() {
    currrentPage = 0;
    playSound(1);
    setFirstPageAssets();    
}


function setSecondPage() {
    currrentPage = 1;
    playSound(1);    
    setSecondPageAssets();
}

function setLikeButtonStatus(docu_id) {
    if (getCookie("user_like_" + docu_id) == "liked") {       
        
        if (currrentPage == 0)        
            mSel("#like_button_over").setAttribute("src", "#hearticon");        
        else
            mSel("#like_button_intro").setAttribute("src", "#hearticon");
        return;
    }    
  
    if (currrentPage == 0)        
        mSel("#like_button_over").setAttribute("src", "#hearticon_before");        
    else
        mSel("#like_button_intro").setAttribute("src", "#hearticon_before");
}


function likeMessage()  {
  if (getCookie("user_like_" + currentPostId) == "liked") {
      setCookie("user_like_" + currentPostId, "", 1);
      likeCancelMessage(currentPostId);

        if (currrentPage == 0)
            mSel("#like_button_over").setAttribute("src", "#hearticon_before");        
        else
            mSel("#like_button_intro").setAttribute("src", "#hearticon_before");
      return;
  }

  playSound(0);
  setCookie("user_like_" + currentPostId, "liked", 1);

  if (currrentPage == 0)        
    mSel("#like_button_over").setAttribute("src", "#hearticon");        
  else
    mSel("#like_button_intro").setAttribute("src", "#hearticon");


  var formData = new FormData();
  formData.append("form_kind", "like_action");
  formData.append("user", "eh");
  formData.append("docu_srl", currentPostId);    

  ajaxRequest(formData, function (r) {    
    }, function (r,s,e) {                
  });
}

function likeCancelMessage(docu_id)  {

  var formData = new FormData();
  formData.append("form_kind", "like_action_cancel");
  formData.append("user", "eh");
  formData.append("docu_srl", docu_id);    

  ajaxRequest(formData, function (r) {        
    }, function (r,s,e) {        
  });

}

var currentJobIndex = 0;
function get_messages() {

  var docu_id = jobIds[currentJobIndex];
  currentJobIndex++;

  var formData = new FormData();
  formData.append("form_kind", "get_message");
  formData.append("user", "eh");
  formData.append("docu_srl", docu_id);

  ajaxRequest(formData, function (r) {    
        if (isSet(r) && r.length > 0) {
            var commentArray = [];
            if ("comments" in r[0] && r[0].comments.length > 0) {                
                r[0].comments.forEach(function (v, i, arr) {                
                    commentArray.push(v.content + " | " + v.name);                
                });            
            }

            if (docu_id == "latest") {
                latestPostId = r[0].docu_srl;
                docu_id = latestPostId;
            }
            
            pageContents[docu_id] = {title : r[0].title, content : r[0].content, filename : r[0].file, comments : commentArray, width: r[0].width, height: r[0].height};

            if (currentJobIndex < 2) {
                get_messages();
            }
            else {
                setFirstPage();                
            }
        }

    }, function (r,s,e) {

  });

}


function showComment() {    
    if (commentArrayData.length <= 0) {
        hideTimeout = window.setTimeout(hideComment, 1000);
        return;
    }

    if (currentCommentCount >= commentArrayData.length) currentCommentCount = 0;    
    var textToShow = commentArrayData[currentCommentCount];
    currentCommentCount++;

    if (textToShow.length > 28) {
        textToShow = textToShow.substring(0, 28);
        textToShow += " ...";
    }
    
    $("#comment_area").html(textToShow + " <img src='./assets/icon_heart.png' width='8px'>");
    mSel("#comment_area").classList.remove("fade");    
    hideTimeout = window.setTimeout(hideComment, 3500);
}

function hideComment() {            
    mSel("#comment_area").classList.add("fade");
    showTimeout = window.setTimeout(showComment, 1000);
}


function writeMessage()  {
    var comment = $("#commentInput").val();
    var name = $("#nameInput").val();

    if (!isSet(comment) && comment == "") {
        alert("댓글을 작성해 주세요 :)");
        return;
    }

    if (comment.length > 25) {
        alert("댓글의 길이가 너무 길어요. 25자 이내로 굵고, 짧게 작성 부탁드려요 :)");
        return;
    }

    if (!isSet(name) && name == "") {
        alert("이름을 작성해 주세요 :)");
        return;
    }

    if (name.length > 10) {
        alert("이름의 길이가 너무 길어요. 10자 이내로 작성 부탁드려요 :)");
        return;
    }
 
    var formData = new FormData();
    formData.append("form_kind", "write_comment");
    formData.append("user", 'eh');
    formData.append("docu_srl", currentPostId);
    formData.append("comment", comment);
    formData.append("name", name);

    ajaxRequest(formData, function (r) {        
        commentArrayData.unshift(comment + " | " + name);        
        $("#area_comment_writer").hide();
        mSel("#bottom_border").style.display = 'block';
        mSel("#top_border").style.display = 'block';
        alert("감사합니다. 좋은 하루 되세요!");
    }, function (r,s,e) {
        $("#area_comment_writer").hide();
        mSel("#bottom_border").style.display = 'block';
        mSel("#top_border").style.display = 'block';
        alert("작성 실패! - 잠시 후 다시 시도해 주세요.")
    });
}
