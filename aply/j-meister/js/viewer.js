
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

  function createSnow() {
    const snow = document.createElement('i');
    snow.classList.add('fas');
    snow.classList.add('fa-snowflake');
    snow.style.left = Math.random() * window.innerWidth + 'px';
    snow.style.animationDirection = Math.random() * 3 + 2 + 's';
    snow.style.opacity = Math.random();
    snow.style.fontSize = Math.random() * 10 + 10 + 'px';

    const snowlayer = document.querySelector("#snowlayer");      
    snowlayer.appendChild(snow);
  
    setTimeout(() => {
        snow.remove();
    }, 5000);
  }

  function updateMindSet() {
    const sceneEl = document.querySelector('a-scene');
    const cardTarget = document.querySelector("#guidecard");
    setButtons();

    sceneEl.addEventListener('targetFound', event => {                            
      cardTarget.setAttribute("visible", false);
      setInterval(createSnow, 100);
      showPortfolio();
    });
      
    sceneEl.addEventListener('targetLost', event => {      
      cardTarget.setAttribute("visible", true);
    });    
  }

  updateMindSet();
});    