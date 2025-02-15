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

$(document).ready(function (e) {
    AAPI_setContactForm("aplxcontact");

    if (AAPI_isSet(getCookie("ref1"))) return;
    if (AAPI_isSet(document.referrer) == false) {
        setCookie("ref1", "", 1)
        return;
    }

    setCookie("ref1", document.referrer, 1);
});