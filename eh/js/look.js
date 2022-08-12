$(function() {
    document.title = "포옹전 작품 관람 | APLX";
    eventOC_IN();

    window.onbeforeunload = function (e) {    
        eventOC_OUT();
        return 'Bye';   
    };
    
    updateMindSet();    

    setTimeout(function(){
        // This hides the address bar:
        window.scrollTo(0, 1);
    }, 0);
});  

var currentPostId = 0;
const mindFileList = {
    130: {
        "file": 'invitation.mind', 
        "over_position": "0 0 -0.01", 
        "bottom_position": "0 -0.5 -0.01",
        "width": "1",
        "height": "1.5",
    },

    133: {
        "file": 'invitation.mind', 
        "over_position": "0 0 -0.01", 
        "bottom_position": "0 -0.5 -0.01",
        "width": "1",
        "height": "1.5",
    },
    135: {
        "file": 'invitation.mind', 
        "over_position": "0 0 -0.01", 
        "bottom_position": "0 -0.5 -0.01",
        "width": "1",
        "height": "1.5",
    },
    244: {
        "file": 'invitation.mind', 
        "over_position": "0 0 -0.01", 
        "bottom_position": "0 -0.5 -0.01",
        "width": "1",
        "height": "1.5",
    },
};

function updateMindSet() {
    const setButtons = () => {
        mSel("#qrscan_button").addEventListener('click', function (evt) {       
            playSound(1);
            return;
        });

        mSel("#like_button").addEventListener('click', function (evt) {
            likeMessage();
        });        
    };

    const showPortfolio = () => {
        const portfolio = document.querySelector("#portfolio-panel");
        portfolio.setAttribute("visible", true);  
    };
    

    currentPostId = getQueryVariable("mid");
    if (!isSet(currentPostId)) {
        location.href = "https://aplx.aply.biz";
        return;
    }

    var mindFileName = getMindFileName(currentPostId)["file"];

    const sceneEl = document.querySelector('a-scene');    
    sceneEl.setAttribute("mindar-image", "imageTargetSrc: ./assets/" + mindFileName + "; showStats: false; uiScanning: #example-scanning-overlay; filterMinCF:0.0001; filterBeta: 0.001;");    

    sceneEl.addEventListener('targetFound', event => {      
        mSel("#bottom_border").style.display = 'block';        
        showPortfolio();
    });
        
    sceneEl.addEventListener('targetLost', event => {
        mSel("#bottom_border").style.display = 'none';
    });

    setButtons();
    setFirstPage(currentPostId);
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

function getMindFileName(mid) {
    return mindFileList[mid];
}

function setFirstPage(mid) {
    playSound(1);

    get_message(mid);
    setLikeButtonStatus(mid);
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
        if (isSet(r) && r.length > 0) {
            const comment_a1 = document.querySelector("#comment_a1");
            const comment_a2 = document.querySelector("#comment_a2");
            comment_a1.innerHTML = r[0].title;
            comment_a2.setAttribute("value", r[0].content);
            currentPostId = r[0].docu_srl;
        }

    }, function (r,s,e) {

  });

}
