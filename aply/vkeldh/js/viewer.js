$(function() {
  updateMindSet("vkeldh");
  document.title = "장성주 개발팀장 프로필 | APLY Inc.";
  eventOC_IN();
  window.onbeforeunload = function (e) {    
        eventOC_OUT();
        return undefined;   
  };
});