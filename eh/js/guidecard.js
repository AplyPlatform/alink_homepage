$(function() {
    
    document.title = "포옹전 작품 가이드 | APLX";
    eventOC_IN();    
    window.onbeforeunload = function (e) {    
        eventOC_OUT();
        return undefined;   
    };
    updateMindSet();
});  

var targetFileId = 470;
var currentPostId = -1;
var jobIds = [496, 517];
var pageContents = [];
var currrentPage = 0;
var hideTimeout = -1, showTimeout = -1;

var intervalHandle = null;
var isStop = true;

function updateMindSet() {
    var mindFileName = targetFileId + ".mind";
    $('#front_image').attr("src", "./assets/ex/targets/" + targetFileId + ".jpg");

    setARContent(mindFileName);

    const setButtons = () => {
        mSel("#close_button").addEventListener('click', function (evt) {       
            mSel("#bottom_border").style.display = 'none';
            pauseScroll();
        });

        mSel("#bird1_button").addEventListener('click', function (evt) {
            mSel("#bottom_border").style.display = 'block';
            setFirstPage();            
        });

        mSel("#bird2_button").addEventListener('click', function (evt) {
            mSel("#bottom_border").style.display = 'block';
            setSecondPage();
        });

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
        mSel("#bottom_border").style.display = 'block';
        showPortfolio();
        startHistoryScroll();
    });
        
    sceneEl.addEventListener('targetLost', event => {
        //mSel("#bottom_border").style.display = 'none';
        //pauseScroll();   
    });

    setButtons();
    get_messages();
}

function setARContent(mindFileName) {
    var strContent = '<a-scene loading-screen="dotsColor: red; backgroundColor: black" mindar-image="imageTargetSrc: ./assets/ex/targets/' + mindFileName + '; showStats: false; uiScanning: #example-scanning-overlay; filterMinCF:0.0001; filterBeta: 0.001;" embedded color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false"> \
      \
      <a-camera position="0 0 0" look-controls="enabled: false" cursor="fuse: false; rayOrigin: mouse;" raycaster="far: 10000; objects: .clickable"></a-camera> \
      \
      <a-entity id="card-object-target" mindar-image-target="targetIndex: 0"> \
        <a-entity visible=false id="portfolio-panel" position="0 0 0"> \
          <a-image id="over_image" position="0 0 0.02" width="1.02" height="1.02"></a-image> \
        </a-entity> \
      </a-entity> \
    </a-scene>';

    $('#example-container').append(strContent);    
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

function setPageAssets(docu_id) {
    currentPostId = docu_id;

    var curContent = pageContents[currentPostId];    
    
    mSel("#over_image").setAttribute("src", curContent.filename);

    var ratio = curContent.height / curContent.width;
    mSel("#over_image").setAttribute("height", ratio + 0.02);
    mSel("#over_image").setAttribute("width", 1.02);

    mSel("#comment_a2").innerHTML = curContent.content;
}


function setFirstPage() {
    $("#oScroll").height(window.innerHeight - 190);    
    currrentPage = 0;
    playSound(1);
    pauseScroll();    
    setPageAssets(517);
    startHistoryScroll();
}


function setSecondPage() {    
    currrentPage = 1;
    playSound(1);
    pauseScroll();
    setPageAssets(496);
    startHistoryScroll();
}

var currentJobIndex = 0;
function get_messages() {

  var docu_id = jobIds[currentJobIndex];
  currentJobIndex++;

  var formData = new FormData();
  formData.append("form_kind", "get_message");
  formData.append("user", "eh");
  formData.append("tag", "1");
  formData.append("docu_srl", docu_id);

  ajaxRequest(formData, function (r) {        
    if (isSet(r) && r.length > 0) {                   
        
        pageContents[docu_id] = {title : r[0].title, content : r[0].content, filename : r[0].file, width:r[0].width, height:r[0].height};

        if (currentJobIndex < jobIds.length) {
            get_messages();            
        }
        else {
            setFirstPage();
        }
    }

    }, function (r,s,e) {

  });
}


var vScroll;
function pauseScroll() {
    if(isStop == true) {        
        return;
    }

    isStop = true;
    clearInterval(intervalHandle);
    $("#scroll").scrollTop( 0 );
    $("#oScroll").scrollTop( 0 );
    vScroll = null;
}

function resumeScroll() {
    isStop = false;
    intervalHandle = setInterval("vScroll.move()", 30);
}

function scroll(oid, iid) {
    this.oCont = document.getElementById(oid);
    this.ele = document.getElementById(iid);
    this.height = this.ele.clientHeight;
    this.n = this.oCont.clientHeight - 60;    
    this.move = function () {
        this.ele.style.top = this.n + "px";
        this.n--;

        if ((-this.height) > (this.n - 10)) this.n = this.oCont.clientHeight;
    }
}

function startHistoryScroll() {
    isStop = false;
    vScroll = new scroll("oScroll", "scroll");
    intervalHandle = setInterval("vScroll.move()", 30);
}