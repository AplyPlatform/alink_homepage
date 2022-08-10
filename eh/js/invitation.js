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

        $("#area_comment_writer").hide();
    
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
    };

    const showPortfolio = () => {
        const portfolio = document.querySelector("#portfolio-panel");
        portfolio.setAttribute("visible", true);  
    };
    
    const sceneEl = document.querySelector('a-scene');
    const paintandquestPreviewButton = document.querySelector("#paintandquest-preview-button");
    setButtons();

    sceneEl.addEventListener('targetFound', event => {      
        showPortfolio();
    });
        
    sceneEl.addEventListener('targetLost', event => {
        mSel("#paintandquest-video-mp4").currentTime = 0;
        mSel("#paintandquest-video-mp4").pause();
    }); 
    
    setFirstPage();    
}

function playSound(id) {
    new Audio("./assets/ex/button.wav").play();
}


function setFirstPage() {
    playSound(0);

    mSel("#portfolio-item0").setAttribute("visible", false);
    mSel("#paintandquest-video-mp4").currentTime = 0;
    mSel("#paintandquest-video-mp4").pause();

    mSel("#main_image_area1").setAttribute("src", "#selfi_image");
    mSel("#main_image_area1").setAttribute("visible", true);
    mSel("#main_image_area1").setAttribute("width", "0.5");
    mSel("#main_image_area1").setAttribute("height", "0.7");
    mSel("#main_image_area1").setAttribute("position", "0 0.1 0");

    mSel("#main_image_area2").setAttribute("visible", false);
    mSel("#main_image_area3").setAttribute("visible", false);
    mSel("#main_image_area4").setAttribute("visible", false);
}

function setSecondPage() {
    playSound(1);

    mSel("#portfolio-item0").setAttribute("visible", false);
    mSel("#paintandquest-video-mp4").currentTime = 0;
    mSel("#paintandquest-video-mp4").pause();

    mSel("#main_image_area1").setAttribute("src", "#pencil1_image");
    mSel("#main_image_area2").setAttribute("visible", true);
    mSel("#main_image_area1").setAttribute("width", "0.2");
    mSel("#main_image_area1").setAttribute("height", "0.6");
    mSel("#main_image_area1").setAttribute("position", "0 0.15 0.02");

    mSel("#main_image_area1").setAttribute("src", "#pencil2_image");
    mSel("#main_image_area2").setAttribute("visible", true);
    mSel("#main_image_area2").setAttribute("width", "0.2");
    mSel("#main_image_area2").setAttribute("height", "0.6");
    mSel("#main_image_area2").setAttribute("position", "0.2 0.15 0.1");

    mSel("#main_image_area3").setAttribute("src", "#desk1_image");
    mSel("#main_image_area3").setAttribute("visible", true);
    mSel("#main_image_area3").setAttribute("width", "0.6");
    mSel("#main_image_area3").setAttribute("height", "0.2");
    mSel("#main_image_area3").setAttribute("position", "0 0.15 -0.1");

    mSel("#main_image_area4").setAttribute("src", "#desk2_image");
    mSel("#main_image_area4").setAttribute("visible", true);
    mSel("#main_image_area4").setAttribute("width", "0.6");
    mSel("#main_image_area4").setAttribute("height", "0.2");
    mSel("#main_image_area4").setAttribute("position", "0 -0.06 0.2");

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
}

function setMapPage() {
    playSound(1);
    mSel("#paintandquest-video-mp4").currentTime = 0;
    mSel("#paintandquest-video-mp4").pause();  
}

function mSel(id) {
    return document.querySelector(id);
}
 
function writeMessage()  {
    var comment = $("#commentInput").val();
    var name = $("#nameInput").val();
 
    var formData = new FormData();
    formData.append("form_kind", "write_comment");
    formData.append("user", currentUserId);
    formData.append("docu_srl", currentPostId);
    formData.append("comment", comment);
    formData.append("name", name);

    ajaxRequest(formData, function (r) {
        $("#area_comment_writer").hide();
        window.location.href = window.location.href;
    }, function (r,s,e) {
        $("#area_comment_writer").hide();
        alert("작성 실패! - 잠시 후 다시 시도해 주세요.")
    });
}


function get_message() {
    var formData = new FormData();
    formData.append("form_kind", "get_message");
    formData.append("user", "eh");
  
    ajaxRequest(formData, function (r) {
      const comment_a1 = document.querySelector("#comment_a1");
      const comment_a2 = document.querySelector("#comment_a2");
      comment_a1.setAttribute("value", r[0].title);
      comment_a2.setAttribute("value", r[0].content);
    }, function (r,s,e) {
  
    });
}
 
    
function ajaxRequest(data, callback, errorcallback) {
    $.ajax({
        url: "https://aply.biz/op_aplx/aplx_handler/handler.php",
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