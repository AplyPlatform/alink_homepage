$(function() {
  updateMindSet("hayeon");  
  document.title = "박하연 기획마케팅 팀장 프로필 | APLY Inc.";
  eventOC_IN();
  window.onbeforeunload = function (e) {    
        eventOC_OUT();
        return undefined;   
  };
});    