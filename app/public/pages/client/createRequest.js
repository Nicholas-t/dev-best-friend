function createRequest(method, endpoint, outputType, client_id, api_id, project_id, dev_id, idSelector, _params = null, log = true, _headers = null){
    const params = !_params ? getParams() : _params
    const headers = !_headers ? getHeaders() : _headers
    let status = 0
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
            method, endpoint, params, client_id, api_id, project_id, headers
        })
    }).then((data) => {
        status = data.status
        return data.json()
    }).then((data) => {
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
                    client_id, api_id, project_id, status, dev_id
                })
            })
        }
    })
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

