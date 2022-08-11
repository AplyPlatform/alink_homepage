'use district'

function mSel(id) {
  return document.querySelector(id);
}

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
      return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "iOS";
  }

  return "unknown";
}

  
function ajaxRequest(data, callback, errorcallback) {
  $.ajax({
      url: "https://aply.biz/op_aplx/aplx_handler/handler.php",
      crossDomain: true,
      cache: false,
      data: data,
      type: "POST",      
      contentType: false,
      processData: false,
      beforeSend: function (request) {
          //request.setRequestHeader("droneplay-token", getCookie('user_token'));
      },
      success: function (r) {
          if (r.result != "success" && r.result_code == 1) {              
              return;
          }

          callback(r);
      },
      error: function (request, status, error) {         
          errorcallback(request, status, error);
      }
  });
}

function delCoockie(cName) {
  document.cookie = name + "= " + "; expires=" + date.toUTCString() + "; path=/;";
}

function setCookie(cName, cValue, cDay) {
  var date = new Date();
  date.setTime(date.getTime() + cDay * 60 * 60 * 24 * 1000);
  document.cookie = cName + '=' + cValue + '; expires=' + date.toUTCString() + '; path=/;';
}

function getCookie(cName) {
  let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + cName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));

  return matches ? matches[1] : null;
}