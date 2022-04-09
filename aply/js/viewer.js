
$(function(){ 
  updateMindSet();  
  function updateMindSet() {
    AFRAME.registerComponent('mytarget', {
      init: function () {
        this.el.addEventListener('targetFound', event => {                      
            const cardTarget = document.querySelector("#guidecard");
            cardTarget.setAttribute("visible", false);

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
        this.el.addEventListener('targetLost', event => {
            const cardTarget = document.querySelector("#guidecard");
            cardTarget.setAttribute("visible", true);
        });
      }
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

    couponButton.addEventListener('click', function (evt) {
      window.open("https://aply.biz");
    });    

    setTimeout(() => {
      couponButton.setAttribute("visible", true);
      paintandquestPreviewButton.setAttribute("visible", false);
      document.querySelector("#paintandquest-video-link").setAttribute("src", "#paintandquest-video-mp4");
      document.querySelector("#paintandquest-video-mp4").play();
    }, 600);    
  }

  const showPortfolio = (done) => {
    const portfolio = document.querySelector("#portfolio-panel");    

    let y = 0;
    portfolio.setAttribute("visible", true);

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
});    