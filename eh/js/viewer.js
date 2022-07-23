
$(function(){ 
  updateMindSet();

  AFRAME.registerComponent('button', {
    init: function() {

        const gltf = document.querySelector('#animatedApple');
        var x = gltf.getAttribute('scale').x;
        var y = gltf.getAttribute('scale').y;
        var z = gltf.getAttribute('scale').z;

        // every click, we make our model grow in size :)
        gltf.addEventListener('click', function(ev, target){
            console.log(gltf.getAttribute('scale'));
            gltf.setAttribute('scale', x + " " + y + " "+ z);
            x += 0.1;
            y += 0.1;
            z += 0.1;
        });
    }
  });

  function updateMindSet() {
    let mindStr = '<div><a-scene loading-screen="dotsColor: red; backgroundColor: black" mindar-image="imageTargetSrc: ./assets/target.mind"';

    let bodyStr = mindStr
                  + ' color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false"><a-assets></a-assets>'
                  + '<a-camera position="0 0 0" look-controls="enabled: false" cursor="fuse: false; rayOrigin: mouse;" raycaster="far: 10000; objects: .clickable"></a-camera>'
                  + '<a-entity mindar-image-target="targetIndex: 0">'
                  + '<a-plane id="aplane" class="clickable" geometry="primitive:plane;width:1;height:0.56;" position="0 0 0" material="shader:gif;src:url(./assets/eh.gif);opacity:1.0"></a-plane>'                  
                  
                  + '<a-troika-text id="comment_a1" position="0 0.54 0.1" value="정은혜 작가의 증강현실 프로필 입니다." color="white" align="right" font="../objet/assets/NanumPen.ttf" font-size="0.08" animation="property: scale; to: 1.1 1.1 1.1; dir: alternate; loop: true"></a-troika-text>'
                  + '<a-plane id="bplane" geometry="primitive:plane;width:1;height:0.13;" position="0 0.55 0.09" color="#f00" material="opacity:1.0"></a-plane>'                  
                  + '<a-troika-text id="comment_a2" max-width="1" line-height="1.5" position="0 0.40 0.1" value="하하하" color="white" align="center" font="../objet/assets/NanumPen.ttf" font-size="0.07"></a-troika-text>'

                  + '</a-entity></a-scene></div>';
    bodyStr += '<div id="flipButton"><font size="3" color="white">© 2022 <a href="https://aply.biz" target="_blank"><img src="/assets/images/logo_white.png" border="0" width="45px"></a></font></div>';

    $('body').html(bodyStr);

    get_message();
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
});    