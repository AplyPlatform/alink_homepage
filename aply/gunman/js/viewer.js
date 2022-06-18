
$(function() {     
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