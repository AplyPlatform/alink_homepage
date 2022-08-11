$(function() {
    document.title = "포옹전 | 정은혜 작가와 사진을 | APLX";
    eventOC_IN();

    window.onbeforeunload = function (e) {    
        eventOC_OUT();
        return 'Bye';   
    };
    
    updateMindSet();    

    setTimeout(function(){
        // This hides the address bar:
        window.scrollTo(0, 1);
    }, 0);
});  

function updateMindSet() {
    const setButtons = () => {
        mSel("#qrscan_button").addEventListener('click', function (evt) {       
            playSound(1);
            return;
        });
    };

    const showPortfolio = () => {
        const portfolio = document.querySelector("#portfolio-panel");
        portfolio.setAttribute("visible", true);  
    };
    
    const sceneEl = document.querySelector('a-scene');        

    sceneEl.addEventListener('targetFound', event => {              
        showPortfolio();        
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

function isSet(value) {
    if (typeof (value) === 'number')
        return true;
    if (value == "" || value == null || value == "undefined" || value == undefined)
        return false;
    return true;
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}
