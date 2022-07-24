var currentUserId = "";
var currentPostId = 0;

function InitARS() {
    const area_comment_writer = document.querySelector("#area_comment_writer");
    area_comment_writer.setAttribute("visible", "hidden");
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

        $("#area_comment_writer").hide();
    
        paintandquestPreviewButton.addEventListener('click', function (evt) {
            paintandquestPreviewButton.setAttribute("visible", false);
            document.querySelector("#paintandquest-video-mp4").play();
        });

        const comment_writer = document.querySelector("#comment_writer");
        comment_writer.addEventListener('click', function (evt) {                        
            $("#area_comment_writer").show();
        });

        $("#closeButton").click(function(){
            $("#area_comment_writer").hide();
        });

        $("#replyButton").click(function(){            
            writeMessage();            
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


function get_message(userid) {
    currentUserId = userid;

    var formData = new FormData();
    formData.append("form_kind", "get_message");
    formData.append("user", userid);

    ajaxRequest(formData, function (r) {
        
        const comment_a1 = document.querySelector("#comment_a1");
        const comment_a2 = document.querySelector("#comment_a2");        
        const comment_a3 = document.querySelector("#comment_a3");
        const comment_a4 = document.querySelector("#comment_a4");
        const comment_more = document.querySelector("#comment_more");
        const comment_writer = document.querySelector("#comment_writer");

        currentPostId = r[0].docu_srl;

        let regtime = r[0].regdate.substring(0,8);

        comment_a1.setAttribute("value", r[0].title);
        comment_a2.setAttribute("value", r[0].content + " | " + regtime);

        comment_a3.setAttribute("visible", false);
        comment_a4.setAttribute("visible", false);
        comment_more.setAttribute("visible", false);        

        //TODO
        comment_writer.setAttribute("visible", false);

        if (r[0].comments.length > 0) {
            comment_a3.setAttribute("visible", true);                        
            comment_a3.setAttribute("value", r[0].comments[0].content + " | " + r[0].comments[0].name);

            if (r[0].comments.length > 1) {
                comment_a4.setAttribute("visible", true);
                comment_a4.setAttribute("value", r[0].comments[1].content + " | " + r[0].comments[1].name);                

                if (r[0].comments.length > 2) {
                    comment_more.setAttribute("visible", true);
                    $("#comment_more").click(function() {
                        alert("개발중입니다.");
                    });
                }
            }

        }
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