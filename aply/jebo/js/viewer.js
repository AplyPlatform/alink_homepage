$(function() {
  updateMindSet("jebo");
  document.title = "제보은 COO 프로필 | APLY Inc.";
  eventOC_IN();
  window.onbeforeunload = function (e) {    
        eventOC_OUT();
        return undefined;   
  };
});