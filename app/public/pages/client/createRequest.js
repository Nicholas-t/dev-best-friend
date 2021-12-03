
function _createRequest(method, endpoint, params, client_id, api_id,
     project_id, headers, pathParameter, log, idSelector, outputType, dev_id, cb){
    let requestStatus = 0
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
            method, endpoint, params, client_id, api_id, project_id, headers, pathParameter
        })
    }).then((data) => {
        requestStatus = data.status
        return data.json()
    }).then((data) => {
        if (idSelector){
            if (outputType == "JSON"){
                document.getElementById(`${idSelector}`).innerHTML = `<textarea disabled id="${idSelector}-content" class="form-control" rows="20"></textarea>`
                document.getElementById(`${idSelector}-content`).value = JSON.stringify(data, null, 4)
            } else if (outputType == "Table") {
                document.getElementById(`${idSelector}`).innerHTML = createTable(data)
            } else if (outputType == "Chart") {
                document.getElementById(`${idSelector}`).innerHTML = `
                <canvas id="${idSelector}-chart"></canvas>
                `
                createChart(data, `${idSelector}-chart`)
            }
        }
        if (log){
            fetch(`/db/dev/add/log`, {
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
                    client_id, api_id, project_id, status : requestStatus, dev_id
                })
            })
        }
        cb(data, null)
    }).catch((e)=>{
        console.log(e)
        cb(null, e)
    })
}
function createRequest(method, endpoint, outputType, client_id, api_id, project_id, dev_id, 
    idSelector = null, _params = null, log = true, _headers = null, _pathParameter = null, cb = () => {}){
    const params = !_params ? getParams() : _params
    const headers = !_headers ? getHeaders() : _headers
    const pathParameter = !_pathParameter ? getPathParameter() : _pathParameter
    if(log && !admin){
        fetch(`/db/dev/check-available-credit/${api_id}/${client_id}`).then((data) => {
            return data.json()
        }).then((response) => {
            if (response.error){
                createMessage(response.error, "error")
                cb(null, "Insufficient Credit")
            } else {
                if (response.credit_available <= 0){
                    createMessage("You have used all your credits", "error")
                } else {
                    _createRequest(method, endpoint, params, client_id, api_id, project_id, headers, pathParameter, log, idSelector, outputType, dev_id, cb)
                }
            }
        })
    } else {
        _createRequest(method, endpoint, params, client_id, api_id, project_id, headers, pathParameter, log, idSelector, outputType, dev_id, cb)
    }
}

function getParams(){
    const inputs = document.querySelectorAll("form#playground-form > div > input.form-input")
    const params = {}
    for (let i = 0 ; i < inputs.length ; i++){
        params[inputs[i].name] = inputs[i].value
    }
    return params
}

function getHeaders(){
    const headers = document.querySelectorAll("form#playground-form > div > input.form-headers")
    const header = {}
    for (let i = 0 ; i < headers.length ; i++){
        header[headers[i].name] = headers[i].value
    }
    return header
}

function getPathParameter(){
    const pathParameters = document.querySelectorAll("form#playground-form > div > input.form-path-parameter")
    const pathParameter = {}
    for (let i = 0 ; i < pathParameters.length ; i++){
        pathParameter[pathParameters[i].name] = pathParameters[i].value
    }
    return pathParameter
}

