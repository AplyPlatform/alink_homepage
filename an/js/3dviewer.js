 $(function(){
  updateMindSet();  
  function updateMindSet() {
    let mindStr = '<div><a-scene mindar-image="imageTargetSrc: ./assets/an.mind; filterMinCF:0.0001; filterBeta: 0.001;';    

    let bodyStr = mindStr
                  + 'showStats: false; autoStart: false; maxTrack: 5" color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false">'              
                  + '<a-assets><a-asset-item id="raccoonModel" src="./assets/an.glb"></a-asset-item></a-assets>'
                  + '<a-camera position="0 0 0" look-controls="enabled: false"></a-camera>'
                  + '<a-entity id="target-objet" mindar-image-target="targetIndex: 0">'
                  + ' <a-gltf-model rotation="90 0 0" position="0 0 0" scale="0.8 0.8 0.8" src="#raccoonModel" animation-mixer></a-gltf-model>'
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
});    