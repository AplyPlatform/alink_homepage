$(function() {
  updateMindSet("jmeister");
  document.title = "변지숙 CDO 프로필 | APLY Inc.";
  eventOC_IN();
  window.onbeforeunload = function (e) {    
        eventOC_OUT();
        return undefined;   
  };
});    