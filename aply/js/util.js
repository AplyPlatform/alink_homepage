var currentUserId = "";
var currentPostId = 0;

function InitARS() {
    setCommonTag();

    $("#area_comment_writer").hide();
    $("#bottom_border").hide();    
}

function updateMindSet(userid) {
    currentUserId = userid;

    InitARS();
    
    const portfolio = mSel("#portfolio-panel");
    const sceneEl = document.querySelector('a-scene');
    const cardTarget = mSel("#guidecard");    
    const paintandquestPreviewButton = mSel("#paintandquest-preview-button");    

    const setButtons = () => {            
        
        mSel("#paintandquest-video-link").setAttribute("src", "#paintandquest-video-mp4");        
        paintandquestPreviewButton.addEventListener('click', function (evt) {
            paintandquestPreviewButton.setAttribute("visible", false);
            mSel("#paintandquest-video-mp4").play();
        });

        $("#write_comment_button").click(function(){       
            $("#area_comment_writer").show();
            $("#bottom_border").hide();
        });

        $("#closeButton").click(function(){
            $("#area_comment_writer").hide();
            $("#bottom_border").show();
        });

        $("#replyButton").click(function(){            
            writeMessage();            
        });

        mSel("#like_button").addEventListener('click', function (evt) {
            likeMessage();
        });
    }
    
    // arReady event triggered when ready
    sceneEl.addEventListener("arReady", (event) => {

    });

    // arError event triggered when something went wrong. Mostly browser compatbility issue
    sceneEl.addEventListener("arError", (event) => {

    });

    sceneEl.addEventListener('targetFound', event => {                            
        cardTarget.setAttribute("visible", false);      
        portfolio.setAttribute("visible", true);
        $("#bottom_border").show();
    });
        
    sceneEl.addEventListener('targetLost', event => {            
        paintandquestPreviewButton.setAttribute("visible", true);
        cardTarget.setAttribute("visible", true);
        portfolio.setAttribute("visible", false);
        $("#bottom_border").hide();
        mSel("#paintandquest-video-mp4").currentTime = 0;
        mSel("#paintandquest-video-mp4").pause();
    });

    setButtons();

    get_message();
}

var commentArrayData = [];
var currentCommentCount = 0;
  
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
    formData.append("user", currentUserId);
    formData.append("docu_srl", currentPostId);
    formData.append("comment", comment);
    formData.append("name", name);

    ajaxRequest(formData, function (r) {        
        commentArrayData.unshift(comment + " | " + name);        
        $("#area_comment_writer").hide();
        $("#bottom_border").show();
        alert("감사합니다!");
    }, function (r,s,e) {
        $("#area_comment_writer").hide();
        $("#bottom_border").show();
        alert("작성 실패! - 잠시 후 다시 시도해 주세요.")
    });
}

function get_message() {  
    var formData = new FormData();
    formData.append("form_kind", "get_message");
    formData.append("user", currentUserId);

    ajaxRequest(formData, function (r) {
        
        const comment_a1 = mSel("#comment_a1");
        const comment_a2 = mSel("#comment_a2");
        let regtime = r[0].regdate.substring(0,8);

        comment_a1.setAttribute("value", r[0].title);
        comment_a2.setAttribute("value", r[0].content + " | " + regtime);

        currentPostId = r[0].docu_srl;

        setLikeButtonStatus(currentPostId);

        if ("comments" in r[0] && r[0].comments.length > 0) {
            commentArrayData = [];
            r[0].comments.forEach(function (v, i, arr) {                
                commentArrayData.push(v.content + " | " + v.name);                
            });            

            showComment();
        }

    }, function (r,s,e) {

    });

}

function hideComment() {    
    mSel("#comment_area").classList.add("fade");
    showTimeout = window.setTimeout(showComment, 1000);
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


    mSel("#comment_area").innerHTML = textToShow + " <img src='../assets/icon_heart.png' width='8px'>";
    mSel("#comment_area").classList.remove("fade");
    
    hideTimeout = window.setTimeout(hideComment, 3500);
}

function ajaxRequest(data, callback, errorcallback) {
    $.ajax({
        url: "https://aplx.link/aplx_handler/handler.php",
        crossDomain: true,
        cache: false,
        data: data,
        type: "POST",      
        contentType: false,
        processData: false,
        beforeSend: function (request) {
            //request.setRequestHeader("droneplay-token", getCookie('user_token'));
        },
        success: function (r) {
            if (r.result != "success" && r.result_code == 1) {              
                return;
            }

            callback(r);
        },
        error: function (request, status, error) {         
            errorcallback(request, status, error);
        }
    });
}

function playSound(id) {
    try {
        if (id == 1)
            new Audio("../assets/button.wav").play();
        else
            new Audio("../assets/like.wav").play();
    }
    catch(e) {

    }
}

function setLikeButtonStatus(docu_id) {
    if (getCookie("user_like_" + docu_id) == "liked") {        
        mSel("#like_button").setAttribute("src", "#hearticon");        
        return;
    }    
  
    mSel("#like_button").setAttribute("src", "#hearticon_before");
}


function likeMessage()  {
  if (getCookie("user_like_" + currentPostId) == "liked") {
      setCookie("user_like_" + currentPostId, "", 1);
      likeCancelMessage(currentPostId);
      mSel("#like_button").setAttribute("src", "#hearticon_before");
      return;
  }

  playSound(0);
  setCookie("user_like_" + currentPostId, "liked", 1);
  mSel("#like_button").setAttribute("src", "#hearticon");

  var formData = new FormData();
  formData.append("form_kind", "like_action");
  formData.append("user", currentUserId);
  formData.append("docu_srl", currentPostId);    

  ajaxRequest(formData, function (r) {    
    }, function (r,s,e) {                
  });
}

function likeCancelMessage(docu_id)  {
  var formData = new FormData();
  formData.append("form_kind", "like_action_cancel");
  formData.append("user", currentUserId);
  formData.append("docu_srl", docu_id);    

  ajaxRequest(formData, function (r) {        
    }, function (r,s,e) {        
  });

}

function setCommonTag() {
    var bodyStr = '<div id="bottom_border"> \
        <div class="row" style="margin-top: 13px; margin-bottom: 15px"> \
            <div class="col-8 justify-content-center align-self-center"> \
                <span style="font-size:small;color:#555" id="comment_area"></span> \
            </div> \
            <div class="col-4 justify-content-center align-self-center text-center"> \
                <img id="write_comment_button" src="../assets/icon_write.png" width="30px"> \
            </div> \
            <div class="col-12"> \
                <hr size="1" width="100%" color="#aaa"> \
                <font size="1">POWERED BY <a href="https://aplx.aply.biz" target="_blank"><font color=#5657A6>APLX</font></a> | APLY Inc.</font> \
                <hr size="1" width="100%" color="#aaa"> \
            </div> \
        </div> \
    </div> \
    <div id="area_comment_writer"> \
        <div class="row"> \
        <div class="col-12"> \
            댓글 작성하기 \
        </div> \
        </div> \
        <div class="row"> \
        <div class="col-12"> \
            <input type="text" class="form-control" name="commentInput" id="commentInput" size=10 placeholder="짧은 댓글을 남겨보세요 (25자 이내)"><br> \
        </div> \
        </div> \
        <div class="row"> \
        <div class="col-9"> \
            <input type="text" class="form-control" name="nameInput" id="nameInput" size="5" placeholder="이름 (10자 이내)"> \
            </div> \
            <div class="col-3"> \
            <button id="replyButton" type="button" class="btn btn-comment btn-block">쓰기</button> \
            </div> \
        </div> \
        <div class="row"> \
        <div class="col-12"> \
            <br> \
            <br> \
            <br> \
            <br> \
            <br> \
            <hr> \
            <button id="closeButton" type="button" class="btn btn-comment btn-block">취소</button> \
        </div> \
        </div> \
    </div>';
  $('body').append(bodyStr);
  
  bodyStr = '\
        <div id="example-scanning-overlay" class="hidden"> \
            <div class="inner"> \
                <img src="../assets/card.png"/> \
                <div class="scanline"></div> \
            </div> \
        </div> \
        \
        <a-scene loading-screen="dotsColor: red; backgroundColor: black" mindar-image="imageTargetSrc: ./assets/target.mind; showStats: false; uiScanning: #example-scanning-overlay; filterMinCF:0.0001; filterBeta: 0.001;" embedded color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false">  \
        <a-assets> \
            <img id="hearticon" src="../assets/icon_heart.png" /> \
            <img id="hearticon_before" src="../assets/icon_heart1@3x.png" /> \
            <img id="card" src="../assets/card.png" /> \
            <img id="paintandquest-preview" src="../assets/play.png" /> \
            <img id="paintandquest-write" src="../assets/write.png" /> \
            <video id="paintandquest-video-mp4" autoplay="false" loop="true" src="./assets/title.mp4"></video> \
            <a-asset-item id="waving" src="../assets/target2.glb"></a-asset-item> \
        </a-assets> \
        \
        <a-camera position="0 0 0" look-controls="enabled: false" cursor="fuse: false; rayOrigin: mouse;" raycaster="far: 10000; objects: .clickable"></a-camera> \
        \
        <a-entity id="card-object-target" mindar-image-target="targetIndex: 0"> \
            <a-plane src="#card" position="0 0 0" height="0.15" width="1" rotation="0 0 0" id="guidecard"></a-plane> \
            \
            <a-entity visible=false id="portfolio-panel" position="0 0 0"> \
            <a-entity id="portfolio-item0"> \
                <a-video id="paintandquest-video-link" webkit-playsinline playsinline width="1.09" height="0.59" position="0 0.01 0"></a-video> \
                <a-image id="paintandquest-preview-button" class="clickable" src="#paintandquest-preview" alpha-test="0.5" position="0 0.01 0" width="1.09" height="0.59"></a-image> \
            </a-entity> \
            <a-image class="clickable" id="like_button" src="#hearticon_before" position="0.44 -0.22 0.1" alpha-test="0.5" width="0.1" height="0.1" animation="property: scale; to: 1.1 1.1 1.1; dir: alternate; loop: true"></a-image> \
            <a-gltf-model id="avatar2" rotation="90 0 0" position="0 0.57 0" scale="0.2 0.2 0.2" src="#waving" animation-mixer></a-gltf-model> \
            <a-troika-text id="comment_a1" position="0 -0.40 0.1" value="증강현실 프로필 입니다." color="white" align="right" font="../../objet/assets/NotoSansKR-Regular.otf" font-size="0.08" animation="property: scale; to: 1.1 1.1 1.1; dir: alternate; loop: true"></a-troika-text>           \
            <a-plane position="0 -0.47 0" height="0.01" width="1" color="#fff"></a-plane> \
            <a-troika-text id="comment_a2" max-width="1.2" line-height="1.5" position="0 -0.59 0.1" value="41234123" color="white" align="center" font="../../objet/assets/NotoSansKR-Regular.otf" font-size="0.04"></a-troika-text> \
            </a-entity> \
        </a-entity> \
        </a-scene>';    

  $('#example-container').append(bodyStr);  

  
}