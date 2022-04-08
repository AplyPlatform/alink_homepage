
$(function(){ 
  updateMindSet();

  function updateMindSet() {    
    const portfolio = document.querySelector("#aplane");
    portfolio.addEventListener('click', function (evt) {
      window.open("https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000159707&dispCatNo=90000010001&trackingCd=Home_Planshop3");
    });

    const showPortfolio = () => {
      const portfolio = document.querySelector("#portfolio-panel");
      const paintandquestPreviewButton = document.querySelector("#paintandquest-preview-button");

      let y = 0;
      portfolio.setAttribute("visible", true);

      const id = setInterval(() => {
        y += 0.008;
        if (y >= 0.6) {
          clearInterval(id);          
          paintandquestPreviewButton.addEventListener('click', () => {
            paintandquestPreviewButton.setAttribute("visible", false);            
            document.querySelector("#paintandquest-video-link").setAttribute("src", "#paintandquest-video-mp4");
            document.querySelector("#paintandquest-video-mp4").play();            
          });
        }
        portfolio.setAttribute("position", "0 " + y + " -0.01");
      }, 10);
    }

    AFRAME.registerComponent('mytarget', {
      init: function () {
        this.el.addEventListener('targetFound', event => {  
            setTimeout(() => {
              showPortfolio();
            }, 300);          
        });
        this.el.addEventListener('targetLost', event => {
          console.log("target found");
        });
      }
    });    
  }
});    