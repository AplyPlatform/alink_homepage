$(function() {
    document.title = "정은혜 작가 '포옹전' 초대장 | APLX";    
    eventOC_IN();

    window.onbeforeunload = function (e) {    
        eventOC_OUT();
        return 'Bye';   
    };
    
    updateMindSet();    
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


function get_message(docu_id) {

  var formData = new FormData();
  formData.append("form_kind", "get_message");
  formData.append("user", "eh");
  formData.append("docu_srl", docu_id);

  ajaxRequest(formData, function (r) {        
        const comment_a1 = document.querySelector("#comment_a1");
        const comment_a2 = document.querySelector("#comment_a2");
        comment_a1.innerHTML = r[0].title;
        comment_a2.setAttribute("value", r[0].content);
        currentPostId = r[0].docu_srl;

    }, function (r,s,e) {

  });

}
