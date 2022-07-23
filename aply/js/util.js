
function InitARS() {
    const sceneEl = document.querySelector('a-scene');
    const exampleTarget = document.querySelector('#card-object-target');
    // arReady event triggered when ready
    sceneEl.addEventListener("arReady", (event) => {

    });

    // arError event triggered when something went wrong. Mostly browser compatbility issue
    sceneEl.addEventListener("arError", (event) => {

    });

    // detect target found
    exampleTarget.addEventListener("targetFound", event => {
        console.log("target found");
    });

    // detect target lost
    exampleTarget.addEventListener("targetLost", event => {
        console.log("target lost");
    });
}

function updateMindSet() {
    InitARS();
    const setButtons = () => {    
        const paintandquestPreviewButton = document.querySelector("#paintandquest-preview-button");
        document.querySelector("#paintandquest-video-link").setAttribute("src", "#paintandquest-video-mp4");
    
        paintandquestPreviewButton.addEventListener('click', function (evt) {
            paintandquestPreviewButton.setAttribute("visible", false);
            document.querySelector("#paintandquest-video-mp4").play();
        });
    }
    
    const showPortfolio = () => {
        const portfolio = document.querySelector("#portfolio-panel");
        portfolio.setAttribute("visible", true);  
    }
    
    const sceneEl = document.querySelector('a-scene');
    const cardTarget = document.querySelector("#guidecard");
    const paintandquestPreviewButton = document.querySelector("#paintandquest-preview-button");
    setButtons();

    sceneEl.addEventListener('targetFound', event => {                            
        cardTarget.setAttribute("visible", false);      
        showPortfolio();
    });
        
    sceneEl.addEventListener('targetLost', event => {            
        paintandquestPreviewButton.setAttribute("visible", true);
        cardTarget.setAttribute("visible", true);
        document.querySelector("#paintandquest-video-mp4").stop();
    });    
}
  
  
function get_message(userid) {

    var formData = new FormData();
    formData.append("form_kind", "get_message");
    formData.append("user", userid);

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