"use strict";
  
window.onload = () => {
    
};

function googleinit() {
  if ((typeof gapi) === "undefined" || gapi == null || gapi == "") {
      return;
  }

  gapi.load('auth2', function () { // Ready.
      let gauth = gapi.auth2.init();

      let options = new gapi.auth2.SigninOptionsBuilder();
      options.setPrompt('select_account');

      gauth.attachClickHandler(document.getElementById('googleLoginBtn'), options,
          function (googleUser) {
            setCookie("dev_kind", "google", 1);

            var profile = googleUser.getBasicProfile();
            var token = googleUser.getAuthResponse().id_token;
        
            var name = profile.getName();
            var image = profile.getImageUrl();
            var email = profile.getEmail();
            formSubmit(token, name, image, email);
          }, function (error) {
              //alert(JSON.stringify(error, undefined, 2));
      });
  });
}

function signOut() {
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
      delCookie("dev_kind");
    });  
}

function formSubmit(token, temp_name, temp_image, temp_email) {
    showLoader();

    if (isSet(temp_name) == false) {
        temp_name = "";
    }

    if (isSet(temp_email) == false) {
        temp_email = "";
    }

    if (isSet(temp_image) == false) {
        temp_image = "";
    }

    let skind = getCookie("dev_kind");

    let fd = new FormData();  
    fd.append('form_kind', 'login');  
    fd.append('sns_kind', skind);
    fd.append('sns_id', token);
    fd.append('nickname', temp_name);
    fd.append('email', temp_email);
    fd.append('image', temp_image);
    $.ajax({
        type: 'POST',
        url: 'https://duni.io/arink/cs/handler/handler.php',
        data: fd,
        cache: false,
        processData: false,
        contentType: false                                                    
    }).done(function(data) {
        $("#loginArea").hide();
        setTimeout(() => {
            getReplyContent();
        }, 0);
    });
}

function showLoader() {
  $("#loading").show();
}

function hideLoader() {
  $("#loading").fadeOut(800);
}


function showConfirmDialog() {
  $('#askModalLabel').text(GET_STRING_CONTENT('modal_title'));
  $('#askModalContent').text(GET_STRING_CONTENT('msg_you_are_not_member'));
  $('#askModalOKButton').text(GET_STRING_CONTENT('modal_confirm_btn'));
  $('#askModalCancelButton').hide();

  $('#askModalOKButton').off('click');
  $('#askModalOKButton').click(function (e) {
      e.preventDefault();
      $('#askModal').modal('hide');
      location.href = "/center/register.html";
  });

  $('#askModal').modal('show');
}

function showAlert(msg) {
  $('#modal-title').text("ARink");
  $('#modal-confirm-btn').text("확인");

  $('#errorModalLabel').html(msg);
  $('#errorModal').modal('show');
}

function delCookie(cName) {
  document.cookie = name + "= " + "; expires=" + date.toUTCString() + "; path=/; domain=.aply.biz";
}

function setCookie(cName, cValue, cDay) {
  var date = new Date();
  date.setTime(date.getTime() + cDay * 60 * 60 * 24 * 1000);
  document.cookie = cName + '=' + cValue + '; expires=' + date.toUTCString() + '; path=/; domain=.aply.biz';
}

function getCookie(cName) {
  let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + cName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));

  return matches ? matches[1] : null;
}

function isSet(value) {
  if (typeof (value) === 'number')
      return true;
  if (value == "" || value == null || value == "undefined" || value == undefined)
      return false;
  return true;
}

