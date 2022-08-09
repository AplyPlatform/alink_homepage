$(function(){   
  eventOC_IN();

  window.onbeforeunload = function (e) {    
      eventOC_OUT();
      return 'Bye';   
  };

  InitARS();
  setButtons();
  get_message();
});


function setButtons() {
    $("#area_comment_writer").hide();

    $("#bird1_button").click(function() {
        setFirstPage();
    });

    $("#bird2_button").click(function() {
        setSecondPage();
    });

    $("#bird3_button").click(function() {
        setThirdPage();
    });

    $("#mapicon").click(function() {
        setMapPage();
    });
}

function playSound(id) {
    new Audio("./assets/ex/button.wav").play();
}


function setFirstPage() {
    playSound(0);
    $("#main_image_area1").attr("src", "#selfi_image");
    $("#main_image_area1").attr("width", "0.5");
    $("#main_image_area1").attr("height", "0.7");
    $("#main_image_area1").attr("position", "0 0.1 0");

    $("#main_image_area2").attr("visible", "false");
    $("#main_image_area3").attr("visible", "false");
    $("#main_image_area4").attr("visible", "false");
}

function setSecondPage() {
    playSound(1);
    $("#main_image_area1").attr("src", "#pencil1_image");
    $("#main_image_area1").attr("width", "0.2");
    $("#main_image_area1").attr("height", "0.6");
    $("#main_image_area1").attr("position", "0 0.15 0.02");

    $("#main_image_area1").attr("src", "#pencil2_image");
    $("#main_image_area2").attr("visible", "true");
    $("#main_image_area2").attr("width", "0.2");
    $("#main_image_area2").attr("height", "0.6");
    $("#main_image_area2").attr("position", "0.2 0.15 0.1");

    $("#main_image_area1").attr("src", "#desk1_image");
    $("#main_image_area3").attr("visible", "true");
    $("#main_image_area3").attr("width", "0.6");
    $("#main_image_area3").attr("height", "0.2");
    $("#main_image_area3").attr("position", "0 0.15 -0.1");

    $("#main_image_area1").attr("src", "#desk2_image");
    $("#main_image_area4").attr("visible", "true");
    $("#main_image_area4").attr("width", "0.6");
    $("#main_image_area4").attr("height", "0.2");
    $("#main_image_area4").attr("position", "0 -0.06 0.2");

}

function setThirdPage() {
    
}

function setMapPage() {
    
}

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