
var isTopShow = false;

$(function() {
    document.title = "포옹전 | 정은혜 작가와 사진을 | APLX";
    eventOC_IN();    
    window.onbeforeunload = function (e) {    
        eventOC_OUT();
        return undefined;   
    };

    updateMindSet();
});  

function updateMindSet() {
    const setButtons = () => {
        mSel("#qrscan_button").addEventListener('click', function (evt) {       
            playSound(1);
            return;
        });
    };

    const sceneEl = document.querySelector('a-scene');        

    sceneEl.addEventListener('targetFound', event => {
        mSel("#top_border").style.display = 'none';        
    });
        
    sceneEl.addEventListener('targetLost', event => {        
        mSel("#top_border").style.display = 'block';
    });

    setButtons();    

    let today = new Date();   

    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    mSel("#today_text").setAttribute("value", year + "년 " + month + "월 " + date + "일 정은혜 작가님과 함께")
}

function playSound(id) {
    try {
        if (id == 1)
            new Audio("./assets/ex/button.wav").play();
        else
            new Audio("./assets/ex/like.wav").play();
    }
    catch(e) {

    }
}
