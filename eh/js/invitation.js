$(function() {
    document.title = "정은혜 작가 '포옹전' 초대장 | APLX";    
    
    eventOC_IN();    
    window.onbeforeunload = function (e) {    
        eventOC_OUT();
        return undefined;   
    };

    updateMindSet();    
});

var commentArrayData = [];
var currentCommentCount = 0;
var currrentPage = 0;
var hideTimeout = -1, showTimeout = -1;

function updateMindSet() {
    const setButtons = () => {            
        mSel("#paintandquest-video-link").setAttribute("src", "#paintandquest-video-mp4");

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

        mSel("#bird3_button").addEventListener('click', function (evt) {       
            setThirdPage();
        });

        mSel("#map_button").addEventListener('click', function (evt) {
            setMapPage();
        });

        mSel("#like_button").addEventListener('click', function (evt) {
            likeMessage();
        });        


        mSel("#write_comment_button").addEventListener('click', function (evt) {
            mSel("#bottom_border").style.display = 'none';
            mSel("#top_border").style.display = 'none';
            mSel("#paintandquest-video-mp4").currentTime = 0;
            mSel("#paintandquest-video-mp4").pause();
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

    const showPortfolio = () => {
        const portfolio = document.querySelector("#portfolio-panel");
        portfolio.setAttribute("visible", true);  
    };
    
    const sceneEl = document.querySelector('a-scene');
    //if (getMobileOperatingSystem() == "iOS") {        
    //    sceneEl.setAttribute("mindar-image", "imageTargetSrc: ./assets/invitation.mind; showStats: false; uiScanning: #example-scanning-overlay;");
    //}
    //else {
        sceneEl.setAttribute("mindar-image", "imageTargetSrc: ./assets/invitation.mind; showStats: false; uiScanning: #example-scanning-overlay; filterMinCF:0.0001; filterBeta: 0.001;");
    //}

    sceneEl.addEventListener('targetFound', event => {      
        mSel("#bottom_border").style.display = 'block';
        mSel("#top_border").style.display = 'block';
        showPortfolio();
    });
        
    sceneEl.addEventListener('targetLost', event => {
        mSel("#bottom_border").style.display = 'none';
        mSel("#top_border").style.display = 'none';
        mSel("#paintandquest-video-mp4").currentTime = 0;
        mSel("#paintandquest-video-mp4").pause();
    });
    
    setButtons();
    setFirstPage();
    showComment();
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


function setFirstPage() {
    currrentPage = 0;
    playSound(1);

    mSel("#portfolio-item0").setAttribute("visible", false);
    mSel("#paintandquest-video-mp4").currentTime = 0;
    mSel("#paintandquest-video-mp4").pause();

    mSel("#main_image_area1").setAttribute("src", "#selfi_image");
    mSel("#main_image_area1").setAttribute("visible", true);
    mSel("#main_image_area1").setAttribute("width", "0.62");
    mSel("#main_image_area1").setAttribute("height", "0.76");
    mSel("#main_image_area1").setAttribute("position", "0 0.1 0");

    mSel("#main_image_area2").setAttribute("visible", false);
    mSel("#main_image_area3").setAttribute("visible", false);
    mSel("#main_image_area4").setAttribute("visible", false);

    get_message(230);
    setLikeButtonStatus(230);
}


function setSecondPage() {
    currrentPage = 1;
    playSound(1);

    mSel("#portfolio-item0").setAttribute("visible", false);
    mSel("#paintandquest-video-mp4").currentTime = 0;
    mSel("#paintandquest-video-mp4").pause();

    mSel("#main_image_area1").setAttribute("src", "#pencil1_image");
    mSel("#main_image_area1").setAttribute("visible", true);
    mSel("#main_image_area1").setAttribute("width", "0.4");
    mSel("#main_image_area1").setAttribute("height", "0.6");
    mSel("#main_image_area1").setAttribute("position", "-0.1 0.15 0.011");

    mSel("#main_image_area2").setAttribute("src", "#pencil2_image");
    mSel("#main_image_area2").setAttribute("visible", true);
    mSel("#main_image_area2").setAttribute("width", "0.4");
    mSel("#main_image_area2").setAttribute("height", "0.6");
    mSel("#main_image_area2").setAttribute("position", "0.1 0.15 0.014");

    mSel("#main_image_area3").setAttribute("src", "#desk1_image");
    mSel("#main_image_area3").setAttribute("visible", true);
    mSel("#main_image_area3").setAttribute("width", "0.6");
    mSel("#main_image_area3").setAttribute("height", "0.3");
    mSel("#main_image_area3").setAttribute("position", "0 0.15 0.013");

    mSel("#main_image_area4").setAttribute("src", "#desk2_image");
    mSel("#main_image_area4").setAttribute("visible", true);
    mSel("#main_image_area4").setAttribute("width", "0.6");
    mSel("#main_image_area4").setAttribute("height", "0.3");
    mSel("#main_image_area4").setAttribute("position", "0 -0.06 0.012");

    get_message(238);
    setLikeButtonStatus(238);
}


function setThirdPage() {    
    currrentPage = 2;
    playSound(1);

    mSel("#main_image_area1").setAttribute("visible", false);
    mSel("#main_image_area2").setAttribute("visible", false);
    mSel("#main_image_area3").setAttribute("visible", false);
    mSel("#main_image_area4").setAttribute("visible", false);

    mSel("#portfolio-item0").setAttribute("visible", true);
    mSel("#paintandquest-preview-button").setAttribute("visible", true);    
    
    mSel("#paintandquest-preview-button").addEventListener('click', function (evt) {    
        mSel("#paintandquest-preview-button").setAttribute("visible", false);
        mSel("#paintandquest-video-link").play();
    });

    get_message(240);
    setLikeButtonStatus(240);
}


function setMapPage() {
    playSound(1);
    mSel("#paintandquest-video-mp4").currentTime = 0;
    mSel("#paintandquest-video-mp4").pause();
    window.open("https://naver.me/xkx9kjNi", "_blank");
}

var currentPostId = 0;

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

    var frontStr = "";
    switch (currrentPage) {
        case 0:
            frontStr = "<img src='./assets/ex/icon_bird1@3x.png' width='10px' height='12px'> ";
            break;

        case 1:
            frontStr = "<img src='./assets/ex/icon_bird2@3x.png' width='10px' height='12px'> ";
            break;

        case 2:
            frontStr = "<img src='./assets/ex/icon_bird3@3x.png' width='10px' height='12px'> ";
            break;
    }

    mSel("#comment_area").innerHTML = frontStr + textToShow + " <img src='./assets/icon_heart.png' width='8px'>";
    mSel("#comment_area").classList.remove("fade");
    
    hideTimeout = window.setTimeout(hideComment, 3500);
}

function hideComment() {    
    mSel("#comment_area").classList.add("fade");
    showTimeout = window.setTimeout(showComment, 1000);
}

function get_message(docu_id) {

  var formData = new FormData();
  formData.append("form_kind", "get_message");
  formData.append("user", "eh");
  formData.append("docu_srl", docu_id);

  ajaxRequest(formData, function (r) {        
    if (isSet(r) && r.length > 0) {        
        const comment_a1 = document.querySelector("#comment_a1");
        const comment_a2 = document.querySelector("#comment_a2");
        comment_a1.innerHTML = r[0].title;
        comment_a2.setAttribute("value", r[0].content);
        currentPostId = r[0].docu_srl;

        if ("comments" in r[0] && r[0].comments.length > 0) {
            commentArrayData = [];
            r[0].comments.forEach(function (v, i, arr) {                
                commentArrayData.push(v.content + " | " + v.name);                
            });            
        }
    }

    }, function (r,s,e) {

  });

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
        alert("감사합니다, '포옹전'에서 뵈어요!");
    }, function (r,s,e) {
        $("#area_comment_writer").hide();
        mSel("#bottom_border").style.display = 'block';
        mSel("#top_border").style.display = 'block';
        alert("작성 실패! - 잠시 후 다시 시도해 주세요.")
    });
}