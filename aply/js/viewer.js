
$(function(){ 
  updateMindSet();  
  function updateMindSet() {
    const sceneEl = document.querySelector('a-scene');
    sceneEl.addEventListener('targetFound', event => {                      
      const cardTarget = document.querySelector("#guidecard");
      cardTarget.setAttribute("visible", false);

      setInterval(createSnow, 100);
      showAvatar(() => {
        setTimeout(() => {
          showPortfolio(() => {
            setTimeout(() => {
              setButtons();
            }, 300);
          });
        }, 300);          
      });      
    });

    sceneEl.addEventListener('targetLost', event => {
      const cardTarget = document.querySelector("#guidecard");
      cardTarget.setAttribute("visible", true);
    });
  }

  const showAvatar = (onDone) => {
    const avatar = document.querySelector("#avatar");
    let z = -0.3;
    const id = setInterval(() => {
      z += 0.02;
      if (z >= 1.5) {
        clearInterval(id);
        onDone();
      }
      avatar.setAttribute("position", "0 -0.25 " + z);
    }, 10);
  }

  const setButtons = () => {
    const goButton = document.querySelector("#go-button");
    const paintandquestPreviewButton = document.querySelector("#paintandquest-preview-button");
    document.querySelector("#paintandquest-video-link").setAttribute("src", "#paintandquest-video-mp4");

    goButton.addEventListener('click', function (evt) {
      window.open("https://aply.biz");
    });    

    paintandquestPreviewButton.addEventListener('click', function (evt) {
      document.querySelector("#paintandquest-video-mp4").play();
    });

    setTimeout(() => {
      goButton.setAttribute("visible", true);            
    }, 600);    
  }

  const showPortfolio = (done) => {
    const portfolio = document.querySelector("#portfolio-panel");    

    let y = 0;
    portfolio.setAttribute("visible", true);

    done();
    return;
    

    const id = setInterval(() => {
      y += 0.008;
      if (y >= 0.6) {
        clearInterval(id);
        setTimeout(() => {
          done();
        }, 500);
      }
      portfolio.setAttribute("position", "0 " + y + " -0.01");
    }, 10);
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
});    