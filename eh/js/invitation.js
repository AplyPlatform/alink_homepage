$(function() {
    eventOC_IN();

    window.onbeforeunload = function (e) {    
        eventOC_OUT();
        return 'Bye';   
    };
    
    updateMindSet();
    get_message();
  });  


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
    };

    const showPortfolio = () => {
        const portfolio = document.querySelector("#portfolio-panel");
        portfolio.setAttribute("visible", true);  
    };
    
    const sceneEl = document.querySelector('a-scene');
    if (getMobileOperatingSystem() == "iOS") {        
        sceneEl.setAttribute("mindar-image", "imageTargetSrc: ./assets/invitation.mind; showStats: false; uiScanning: #example-scanning-overlay;");
    }
    else {
        sceneEl.setAttribute("mindar-image", "imageTargetSrc: ./assets/invitation.mind; showStats: false; uiScanning: #example-scanning-overlay; filterMinCF:0.0001; filterBeta: 0.001;");
    }

    sceneEl.addEventListener('targetFound', event => {      
        showPortfolio();
    });
        
    sceneEl.addEventListener('targetLost', event => {
        mSel("#paintandquest-video-mp4").currentTime = 0;
        mSel("#paintandquest-video-mp4").pause();
    });

    setButtons();
    setFirstPage();

    if (getCookie("user_like") == "liked") {
        mSel("#like_button").setAttribute("src", "#hearticon");
    }
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

var title_str;
var content_str;

function setFirstPage() {
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

    mSel("#comment_a1").setAttribute("value", title_str);
    mSel("#comment_a2").setAttribute("value", content_str);
}


function setSecondPage() {
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

    mSel("#comment_a2").setAttribute("value", "오늘도 작업실에서 그림작업을 하고 있읍니다. 이제는 자유롭게 그림도 그리고 편안하게 할거예요. 좋아요.");
}


function setThirdPage() {    

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

    mSel("#comment_a2").setAttribute("value", "포옹 전시를 할 겁니다. 인사동 토포하우스에서 8월 24일부터 30일까지 합니다. 오셔서 작가님 배우와 만나서 포옹안겨줄께요.");
}


function setMapPage() {
    playSound(1);
    mSel("#paintandquest-video-mp4").currentTime = 0;
    mSel("#paintandquest-video-mp4").pause();
    window.open("https://naver.me/xkx9kjNi", "_blank");
}


var currentPostId = 0;

function likeMessage()  {

  if (getCookie("user_like") == "liked") {
      setCookie("user_like", "", 1);
      likeCancelMessage();
      mSel("#like_button").setAttribute("src", "#hearticon_before");
      return;
  }

  playSound(0);
  setCookie("user_like", "liked", 1);
  mSel("#like_button").setAttribute("src", "#hearticon");

  var formData = new FormData();
  formData.append("form_kind", "like_action");
  formData.append("user", "eh");
  formData.append("docu_srl", currentPostId);    

  ajaxRequest(formData, function (r) {    
    }, function (r,s,e) {                
  });
}

function likeCancelMessage()  {

  var formData = new FormData();
  formData.append("form_kind", "like_action_cancel");
  formData.append("user", "eh");
  formData.append("docu_srl", currentPostId);    

  ajaxRequest(formData, function (r) {        
    }, function (r,s,e) {        
  });

}


function get_message() {

  var formData = new FormData();
  formData.append("form_kind", "get_message");
  formData.append("user", "eh");

  ajaxRequest(formData, function (r) {
        title_str = r[0].title;
        content_str = r[0].content;

        const comment_a1 = document.querySelector("#comment_a1");
        const comment_a2 = document.querySelector("#comment_a2");
        comment_a1.setAttribute("value", r[0].title);
        comment_a2.setAttribute("value", r[0].content);
        currentPostId = r[0].docu_srl;

    }, function (r,s,e) {

  });

}
