
$(function(){
  updateMindSet();

  function updateMindSet() {
    let mindStr = '<div><a-scene mindar-image="imageTargetSrc: /alink/alinkassets/targets.mind;"';

    let bodyStr = mindStr
                  + ' color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false"><a-assets></a-assets>'
                  + '<a-camera position="0 0 0" look-controls="enabled: false"></a-camera>'
                  + '<a-entity mindar-image-target="targetIndex: 0">'
                  + '<a-plane rotation="90 0 0" geometry="primitive:plane;width:0.5;height:0.5;" material="shader:gif;src:url(/alink/alinkassets/0.gif);opacity:0.8"></a-plane>'
                  + '</a-entity></a-scene></div>';
    bodyStr += '<div id="flipButton"><font size="3" color="white">© 2022 <a href="https://aply.biz" target="_blank"><img src="/assets/images/logo_white.png" border="0" width="45px"></a></font></div>';

    $('body').html(bodyStr);
  }
});    