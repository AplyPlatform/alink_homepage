 $(function(){ 

  let effAssetIndex = 6;
  let mname = getQueryVariable("mname");
  updateMindSet(mname);  
  function updateMindSet(mindname) {
    let mindStr = '<div><a-scene mindar-image="imageTargetSrc: /arink/arinkassets/targets.mind;';

    if (isSet(mindname)) {
      mindStr = '<div><a-scene mindar-image="imageTargetSrc: /arink/arinkassets/' + mindname + '.mind;';
    }

    let bodyStr = mindStr
                  + 'showStats: false; autoStart: false; maxTrack: 5" color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false">'
                  //+ '<a-assets><a-asset-item id="raccoonModel" src="/arink/arinkassets/raccoon/scene.gltf"></a-asset-item></a-assets>'
                  + '<a-assets><a-asset-item id="raccoonModel" src="/arink/arinkassets/atext.glb"></a-asset-item></a-assets>'
                  //+ '<a-assets><a-asset-item id="raccoonModel" src="/arink/arinkassets/dino.glb"></a-asset-item></a-assets>'
                  + '<a-camera position="0 0 0" look-controls="enabled: false"></a-camera>'
                  + '<a-entity id="target-objet" mindar-image-target="targetIndex: 0">'
                  + ' <a-gltf-model rotation="90 0 0 " position="0 0 0" scale="0.2 0.2 0.2" src="#raccoonModel" animation-mixer></a-gltf-model>'
                  + '</a-entity></a-scene></div>';                  
    
    bodyStr += '<div id="flipButton"><font size="3" color="white">© 2022 <a href="https://aply.biz" target="_blank"><img src="/assets/images/logo_white.png" border="0" width="45px"></a></font></div>';

    $('body').html(bodyStr);    

    setTimeout(doStart, 1000);    
  }

  function doStart() {    
    const sceneEl = document.querySelector('a-scene');
    const arSystem = sceneEl.systems["mindar-image-system"];
    arSystem.start(); // start AR

    const objetTarget = document.querySelector('#target-objet');
    objetTarget.addEventListener("targetFound", event => {
      console.log("found!!")
    });
  }

  function updateEffect(mindname, effectname) {
    let mindStr = '<div><a-scene mindar-image="imageTargetSrc: /arink/arinkassets/targets.mind;"';

    if (isSet(mindname)) {
      mindStr = '<div><a-scene mindar-image="imageTargetSrc: /arink/arinkassets/' + mindname + '.mind;"';                
    }

    let bodyStr = mindStr
                  + 'embedded color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false"><a-assets></a-assets>'
                  + '<a-camera position="0 0 0" look-controls="enabled: false"></a-camera>'
                  + '<a-entity mindar-image-target="targetIndex: 0">'
                  + '<a-gltf-model rotation="90 0 0 " position="0 0 0" scale="0.05 0.05 0.05" src="#avatarModel" animation="property: position; to: 0 0.1 0.1; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate">'
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