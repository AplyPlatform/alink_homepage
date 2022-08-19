
function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function eventOC_IN() {


    var aid = getCookie("aid");
    var is_first_str = "false";    
    if (aid == null || aid == "") {        
        is_first_str = "true";
        aid = generateUUID();
        setCookie("aid", aid, 100);
    }

    var formData = new FormData();
    formData.append("form_kind", "set_event");
    formData.append("ekind", "in");
    formData.append("aid", aid);
    formData.append("etitle", document.title);
    formData.append("eurl", document.URL);
    formData.append("is_first", is_first_str);

    dataRequest(formData, function (r) {
                
    }, function (r,s,e) {
    
    });

}

function eventOC_OUT() {
    var aid = getCookie("aid");
    var formData = new FormData();
    formData.append("form_kind", "set_event");
    formData.append("ekind", "out");
    formData.append("aid", aid);
    formData.append("etitle", document.title);
    formData.append("eurl", document.URL);

    dataRequest(formData, function (r) {
                
    }, function (r,s,e) {
    
    });

}

function dataRequest(data, callback, errorcallback) {
    $.ajax({
        url: "https://aply.biz/aplx_handler/handler.php",
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