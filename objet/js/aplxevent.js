

function eventOC_IN() {
    var formData = new FormData();
    formData.append("form_kind", "set_event");
    formData.append("ekind", "in");
    formData.append("etitle", document.title);
    formData.append("eurl", document.URL);

    dataRequest(formData, function (r) {
                
    }, function (r,s,e) {
    
    });

}

function eventOC_OUT() {
    var formData = new FormData();
    formData.append("form_kind", "set_event");
    formData.append("ekind", "out");
    formData.append("etitle", document.title);
    formData.append("eurl", document.URL);

    dataRequest(formData, function (r) {
                
    }, function (r,s,e) {
    
    });

}

function dataRequest(data, callback, errorcallback) {
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