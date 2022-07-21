
$(function() {     

  const sceneEl = document.querySelector('a-scene');
  const exampleTarget = document.querySelector('#card-object-target');
  // arReady event triggered when ready
  sceneEl.addEventListener("arReady", (event) => {
	  //loadingOverlay.style.display = "none";
    });

// arError event triggered when something went wrong. Mostly browser compatbility issue
    sceneEl.addEventListener("arError", (event) => {
//loadingOverlay.style.display = "none";
//compatibilityOverlay.style.display = "block";
    });


	// detect target found
    exampleTarget.addEventListener("targetFound", event => {
      console.log("target found");
    });

// detect target lost
    exampleTarget.addEventListener("targetLost", event => {
      console.log("target lost");
    });


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
    return;
    
    const avatar = document.querySelector("#avatar");
    let z = -0.3;
    const id = setInterval(() => {
      z += 0.02;
      if (z >= 1.5) {
        clearInterval(id);
      }
      avatar.setAttribute("position", "0 0 " + z);
    }, 10);    
  }

  function updateMindSet() {
    const sceneEl = document.querySelector('a-scene');
    const cardTarget = document.querySelector("#guidecard");
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

  updateMindSet();
});    