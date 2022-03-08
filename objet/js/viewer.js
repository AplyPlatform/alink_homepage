
$(function(){ 
  let effAssetIndex = 6;
  let mname = getQueryVariable("mname");
  updateMindSet(mname);

  function updateMindSet(mindname) {
    let mindStr = '<div><a-scene mindar-image="imageTargetSrc: /objet/assets/targets.mind;"';

    if (isSet(mindname)) {
      if (mindname == "beautiful") {
        mindStr = '<div><a-scene mindar-image="imageTargetSrc: /objet/assets/beautiful.mind;"';
      }
      else {
        mindStr = '<div><a-scene mindar-image="imageTargetSrc: https://duni.io/arink/assets/' + mindname + '.mind;"';
      }
    }

    let bodyStr = mindStr
                  + ' color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false"><a-assets></a-assets>'
                  + '<a-camera position="0 0 0" look-controls="enabled: false"></a-camera>'
                  + '<a-entity mindar-image-target="targetIndex: 0">'
                  + '<a-plane geometry="primitive:plane;width:2;height:2;" material="shader:gif;src:url(/objet/assets/6.gif);opacity:0.8"></a-plane>'
                  + '</a-entity></a-scene></div>';
    bodyStr += '<div id="flipButton"><font size="3" color="white">© 2022 <a href="https://aply.biz" target="_blank"><img src="https://aply.biz/assets/images/logo_white.png" border="0" width="45px"></a></font></div>';

    $('body').html(bodyStr);
    $('body').click(function(e){
        effAssetIndex--;
        if (effAssetIndex < 0) effAssetIndex = 6;
        updateEffect(mindname, effAssetIndex);
    });
  }

  function updateEffect(mindname, effectname) {
    let mindStr = '<div><a-scene mindar-image="imageTargetSrc: /objet/assets/targets.mind;"';

    if (isSet(mindname)) {
      if (mindname == "beautiful") {
        mindStr = '<div><a-scene mindar-image="imageTargetSrc: /objet/assets/beautiful.mind;"';
      }
      else {
        mindStr = '<div><a-scene mindar-image="imageTargetSrc: https://duni.io/arink/assets/' + mindname + '.mind;"';
      }
    }

    let bodyStr = mindStr
                  + ' color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false"><a-assets></a-assets>'
                  + '<a-camera position="0 0 0" look-controls="enabled: false"></a-camera>'
                  + '<a-entity mindar-image-target="targetIndex: 0">'
                  + '<a-plane geometry="primitive:plane;width:2;height:2;" material="shader:gif;src:url(/objet/assets/' + effectname + '.gif);opacity:0.8"></a-plane>'
                  + '</a-entity></a-scene></div>';
    
    bodyStr += '<div id="flipButton"><font size="3" color="white">© 2022 <a href="https://aply.biz" target="_blank"><img src="https://aply.biz/assets/images/logo_white.png" border="0" width="45px"></a></font></div>';

    $('body').html(bodyStr);
  }

  function isSet(value) {
    if (typeof (value) === 'number')
        return true;
    if (value == "" || value == null || value == "undefined" || value == undefined)
        return false;
    return true;
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
  }

});    