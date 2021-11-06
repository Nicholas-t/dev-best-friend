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

function fillApiField(api_id){
    _fillForm(api_id)
    _fillLog(api_id)
}
