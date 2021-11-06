function runTest(){
    const method = document.getElementById("method").value
    const endpoint = document.getElementById("endpoint").value
    const params = {}
    let keysElement = document.querySelectorAll(`input[id^="test-key"]`)
    let valuesElement = document.querySelectorAll(`input[id^="test-value"]`)
    const headers = {}
    let keysHeaderElement = document.querySelectorAll(`input[id^="test-header-key"]`)
    let valuesHeaderElement = document.querySelectorAll(`input[id^="test-header-value"]`)
    for (let i = 0; i < keysElement.length ; i++){
        if (keysElement[i].value != '' && 
        !Object.keys(params).includes(keysElement[i].value)){
            params[keysElement[i].value] = valuesElement[i].value
        }
    }
    for (let i = 0; i < keysHeaderElement.length ; i++){
        if (keysHeaderElement[i].value != '' && 
        !Object.keys(headers).includes(keysHeaderElement[i].value)){
            headers[keysHeaderElement[i].value] = valuesHeaderElement[i].value
        }
    }
    fetch(`/dev/api/create-request`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache', 
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer', 
        body: JSON.stringify({
            method, endpoint, params, headers
        })
    }).then((data) => {
        return data.json()
    }).then((data) => {
        let outputType = document.getElementById("output_type").value
        if (outputType == "JSON"){
            document.getElementById("test-output").innerHTML = `<textarea disabled id="test-output-content" class="form-control" rows="8"></textarea>`
            document.getElementById("test-output-content").value = JSON.stringify(data, null, 4)
        } else if (outputType == "Table") {
            document.getElementById("test-output").innerHTML = createTable(data)
        } else if (outputType == "Chart") {
            document.getElementById("test-output").innerHTML = `<canvas id="chart"></canvas>`
            createChart(data)
        } else if (outputType == "File") {
            console.log(data)
        }
    })
}

function removeInput(n){
    document.getElementById(`test-input-${n}`).remove()
}

function removeHeader(n){
    document.getElementById(`test-header-${n}`).remove()
}

function changeValueType(n){
    const type = document.getElementById(`test-value-type-${n}`).value
    let value = document.getElementById(`test-value-${n}`)
    if (type == "Number") {
        value.setAttribute('type','number')
    }
    if (type == "Date") {
        value.setAttribute('type','datetime-local')
    }
    if (type == "String") {
        value.setAttribute('type','text')
    }
    if (type == "Boolean") {
        value.setAttribute('type','checkbox')
    }
    if (type == "Color") {
        value.setAttribute('type','color')
    }
}

let l = 1
function addNewInput(){
    let d = `
    <div id="test-input-${l}">
        <div class="row">
            <div class="form-group col-6">
                <label>Key</label>
                <input required type="text" class="form-control" id="test-key-${l}" placeholder="Key">
            </div>
            <div class="form-group col-6">
                <label>Type</label>
                <select onchange="changeValueType(${l})" id="type-of-test-value-${l}"class="form-control">
                <option>String</option>
                <option>Number</option>
                <option>Date</option>
                <option>Boolean</option>
                <option>Color</option>
                </select>
            </div>
        </div>
        
        <div class="row">
            <div style="margin-top: 30px;" class="form-group col-3">
                <a onclick="removeInput(${l})" class="btn btn-danger mr-2">Remove Input</a>
            </div>
            <div class="form-group col-9">
                <label>Value</label>
                <input type="text" class="form-control" id="test-value-${l}" placeholder="Value">
            </div>
        </div>
    </div>
    `
    l += 1
    let inputs = document.querySelectorAll(`div[id^="test-input"]`)
    if (!inputs.length) {
        document.getElementById(`testing-area-input`).innerHTML += d;
    } else {
        inputs[inputs.length-1].insertAdjacentHTML("afterend",d);
    }
}


let k = 0
function addNewHeader(){
    let d = `
    <div id="test-header-${k}">
        <div class="row">
            <div class="form-group col-5">
                <label>Key</label>
                <input required type="text" class="form-control" id="test-header-key-${k}" placeholder="Key">
            </div>
            <div class="form-group col-5">
                <label>Value</label>
                <input type="text" class="form-control" id="test-header-value-${k}" placeholder="Value">
            </div>
            <div style="margin-top: 30px;" class="form-group col-2">
                <a onclick="removeHeader(${k})" class="btn btn-danger mr-2">Remove Header</a>
            </div>
        </div>
    </div>
    `
    l += 1
    let headers = document.querySelectorAll(`div[id^="test-header"]`)
    if (!headers.length) {
        document.getElementById(`testing-area-header`).innerHTML += d;
    } else {
        headers[headers.length-1].insertAdjacentHTML("afterend",d);
    }
}


