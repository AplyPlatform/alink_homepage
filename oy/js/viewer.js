
$(function(){ 
  updateMindSet();  
  function updateMindSet() {
    AFRAME.registerComponent('mytarget', {
      init: function () {
        this.el.addEventListener('targetFound', event => {                      
            const cardTarget = document.querySelector("#example-scanning-overlay");
            cardTarget.setAttribute("visible", false);

            setTimeout(() => {
              showPortfolio(() => {
                setTimeout(() => {
                  setButtons();
                }, 300);
              });
            }, 300);          
        });
        this.el.addEventListener('targetLost', event => {
            const cardTarget = document.querySelector("#example-scanning-overlay");
            cardTarget.setAttribute("visible", true);
        });
      }
    });    
  }

  const setButtons = () => {
    const couponButton = document.querySelector("#coupon-button");
    setTimeout(() => {
      couponButton.setAttribute("visible", true);
    }, 600);

    paintandquestPreviewButton.addEventListener('click', () => {
      paintandquestPreviewButton.setAttribute("visible", false);            
      document.querySelector("#paintandquest-video-link").setAttribute("src", "#paintandquest-video-mp4");
      document.querySelector("#paintandquest-video-mp4").play();            
    });

    couponButton.addEventListener('click', function (evt) {
      window.open("https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000159707&dispCatNo=90000010001&trackingCd=Home_Planshop3");
    });    
  }

  const showPortfolio = (done) => {
    const portfolio = document.querySelector("#portfolio-panel");
    const paintandquestPreviewButton = document.querySelector("#paintandquest-preview-button");

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