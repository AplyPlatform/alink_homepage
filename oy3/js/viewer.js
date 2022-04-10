
$(function(){ 
  updateMindSet();  
  function updateMindSet() {
    AFRAME.registerComponent('mytarget', {
      init: function () {
        this.el.addEventListener('targetFound', event => {                      
            const cardTarget = document.querySelector("#guidecard");
            cardTarget.setAttribute("visible", false);
            setInterval(createSnow, 100);
            setTimeout(() => {
              showPortfolio(() => {
                setTimeout(() => {
                  setButtons();
                }, 300);
              });
            }, 300);          
        });
        this.el.addEventListener('targetLost', event => {
            const cardTarget = document.querySelector("#guidecard");
            cardTarget.setAttribute("visible", true);
        });
      }
    });    
  }

  const setButtons = () => {
    const couponButton = document.querySelector("#coupon-button");
    const couponText = document.querySelector("#coupon-text");    

    couponText.addEventListener('click', function (evt) {
      window.open("https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000159707&dispCatNo=90000010001&trackingCd=Home_Planshop3");
    });    

    couponButton.addEventListener('click', function (evt) {
      window.open("https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000159707&dispCatNo=90000010001&trackingCd=Home_Planshop3");
    });    

    setTimeout(() => {
      couponButton.setAttribute("visible", true);
      couponText.setAttribute("visible", true);    
    }, 600);    
  }

  const showPortfolio = (done) => {
    const personButton = document.querySelector("#person-button");
    personButton.addEventListener('click', function (evt) {
      window.open("https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000159707&dispCatNo=90000010001&trackingCd=Home_Planshop3");
    }); 

    let y = 0;
    personButton.setAttribute("visible", true);

    const id = setInterval(() => {
      y += 0.008;
      if (y >= 0.6) {
        clearInterval(id);
        setTimeout(() => {
          done();
        }, 500);
      }
      personButton.setAttribute("position", "0 " + y + " -0.01");
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