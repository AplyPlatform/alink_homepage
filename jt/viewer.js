
$(function(){ 
  updateMindSet();

  function updateMindSet() {
    let mindStr = '<div><a-scene mindar-image="imageTargetSrc: jt.mind;"';

    let bodyStr = mindStr
                  + ' color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false"><a-assets></a-assets>'
                  + '<a-camera position="0 0 0" look-controls="enabled: false"></a-camera>'
                  + '<a-entity mindar-image-target="targetIndex: 0">'
                  + '<a-plane geometry="primitive:plane;width:1;height:0.5;" material="shader:gif;src:url(./jt.gif);opacity:1.0"></a-plane>'
                  + '</a-entity></a-scene></div>';
    bodyStr += '<div id="flipButton"><font size="3" color="white">© 2022 <a href="https://aply.biz" target="_blank"><img src="https://aply.biz/assets/images/logo_white.png" border="0" width="45px"></a></font></div>';

    $('body').html(bodyStr);    
  }
});    