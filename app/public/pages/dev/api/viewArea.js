function _fillForm(api_id){
    fetch(`/db/dev/get/api/${api_id}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache', 
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
    }).then((data) => {
        return data.json()
    }).then((data) => {
        const api = data.result[0]
        document.getElementById("api_name").innerHTML = api.name
        document.getElementById("name").value = api.name
        document.getElementById("endpoint").value = api.endpoint
        document.getElementById("method").value = api.method
        document.getElementById("output_type").value = api.output_type
    })
}

function _fillLog(api_id){
    fetch(`/db/dev/get/log/${api_id}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache', 
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
    }).then((data) => {
        return data.json()
    }).then((data) => {
        console.log(data.result)
    })
}


function removeInput(n){
    document.getElementById(`default-input-${n}`).remove()
}

function removeHeader(n){
    document.getElementById(`default-header-${n}`).remove()
}

function removePathParameter(n){
    document.getElementById(`default-path-parameter-${n}`).remove()
}

let default_l = 0
function addNewDefaultInput(input = false){
    let types = [
        "string",
        "number",
        "datetime-local",
        "checkbox",
        "email",
        "color"
    ]
    let typeHtml = ""
    types.forEach((element) => {
        typeHtml += `<option ${input.type == element ? "selected" : ""} >${element}</option>`
    })
    let d = `
    <div id="default-input-${default_l}">
        <div class="row">
            <div class="form-group col-6">
                <label>Key</label>
                <input ${input ? `value="${input.name}"` : ""} name="default-input-key-${default_l}" required type="text" class="form-control" id="default-key-${default_l}" placeholder="Key">
            </div>
            <div class="form-group col-6">
                <label>Label</label>
                <input ${input ? `value="${input.label}"` : ""} name="default-input-label-${default_l}" required type="text" class="form-control" id="default-key-${default_l}" placeholder="Key">
            </div>
            <div class="form-group col-9">
                <label>Type</label>
                <select name="default-input-type-${default_l}" id="type-of-default-value-${default_l}"class="form-control">
                ${typeHtml}
                </select>
            </div>
            
            <div style="margin-top:30px" class="form-group col-3">
                <a onclick="removeInput(${default_l})" class="btn btn-danger mr-2">Remove Input</a>
            </div>
        </div>
        
    </div>
    `
    default_l += 1
    let inputs = document.querySelectorAll(`div[id^="default-input"]`)
    if (!inputs.length) {
        document.getElementById(`default-area-input`).innerHTML += d;
    } else {
        inputs[inputs.length-1].insertAdjacentHTML("afterend",d);
    }
}


let default_k = 0
function addNewDefaultHeader(header){
    let d = `
    <div id="default-header-${default_k}">
        <div class="row">
            <div class="form-group col-5">
                <label>Key</label>
                <input ${header ? `value="${header.key_header}"` : ""} name="default-header-key-${default_k}" required type="text" class="form-control" id="default-header-key-${default_k}" placeholder="Key">
            </div>
            <div style="margin-top: 30px;" class="form-group col-2">
                <a onclick="removeHeader(${default_k})" class="btn btn-danger mr-2">Remove Header</a>
            </div>
        </div>
    </div>
    `
    default_k += 1
    let headers = document.querySelectorAll(`div[id^="default-header"]`)
    if (!headers.length) {
        document.getElementById(`default-area-header`).innerHTML += d;
    } else {
        headers[headers.length-1].insertAdjacentHTML("afterend",d);
    }
}

let default_m = 0
function addNewDefaultPathParameter(pathParameter){
    let d = `
    <div id="default-path-parameter-${default_m}">
        <div class="row">
            <div class="form-group col-5">
                <label>Key</label>
                <input ${pathParameter ? `value="${pathParameter.name}"` : ""} 
                name="default-path-parameter-key-${default_m}" required type="text" class="form-control" id="default-path-parameter-key-${default_m}" placeholder="Key">
            </div>
            <div class="form-group col-5">
                <label>Label</label>
                <input ${pathParameter ? `value="${pathParameter.name}"` : ""} 
                name="default-path-parameter-label-${default_m}" required type="text" class="form-control" id="default-path-parameter-label-${default_m}" placeholder="Label">
            </div>
            <div style="margin-top: 20px;" class="form-group col-2">
                <a onclick="removePathParameter(${default_m})" class="btn btn-danger mr-2">Remove Path Parameter</a>
            </div>
        </div>
    </div>
    `
    default_m += 1
    let pathParameters = document.querySelectorAll(`div[id^="default-path-parameter"]`)
    if (!pathParameters.length) {
        document.getElementById(`default-area-path-parameter`).innerHTML += d;
    } else {
        pathParameters[pathParameters.length-1].insertAdjacentHTML("afterend",d);
    }
}


function fillApiField(api_id){
    _fillForm(api_id)
    _fillLog(api_id)
    fetch(`/db/dev/get/api/${api_id}/default`).then((data) => {
        return data.json()
    }).then((data) => {
        data.defaultFields.forEach((element) =>{
            if (element.form_type == "header"){
                addNewDefaultHeader(element)
            } else if (element.form_type == "input"){
                addNewDefaultInput(element)
            }  else if (element.form_type == "path_parameter"){
                addNewDefaultPathParameter(element)
            } 
        })
    })
}
