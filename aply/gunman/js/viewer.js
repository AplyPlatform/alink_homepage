$(function() {  
  updateMindSet("gunman");  
  document.title = "이건우 CEO 프로필 | APLY Inc.";
  eventOC_IN();
  window.onbeforeunload = function (e) {    
        eventOC_OUT();
        return undefined;   
  };
});    