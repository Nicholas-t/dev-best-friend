function viewSwaggerContent(userId){
    fetch('/db/dev/get/api/batch').then((data) => {
        return data.json()
    }).then((data) => {
        if (data.length !== 0){
            document.getElementById("api-list").innerHTML = ''
        }
        data.forEach(api => {
            let ok = true
            let detailAltHtml = []
            if (api.input.length){
                let altInputText = []
                api.input.forEach((input) => {
                    if(input.type == "error"){
                        ok = false
                    }
                    altInputText.push(`${input.name} - ${input.label}`)
                })
                detailAltHtml.push(`Input : 
${altInputText.join(`
`)}`)
            }
            if (api.header.length){
                let altHeaderText = []
                api.header.forEach((header) => {
                    altHeaderText.push(`${header.name} - ${header.label}`)
                })
                detailAltHtml.push(`Header : 
${altHeaderText.join(`
`)}`)
            }
            if (api.pathParam.length){
                let altPathParamText = []
                api.pathParam.forEach((pathParam) => {
                    altPathParamText.push(`${pathParam.name} - ${pathParam.label}`)
                })
                detailAltHtml.push(`Path Parameters : 
${altPathParamText.join(`
`)}`)
            }
            document.getElementById("api-list").innerHTML += `
            <tr>
                <td><input ${!ok ? ' disabled="1"' : ' class="apiSelect"'} data='${JSON.stringify(api).split('"').join("\"")}' type="checkbox"></input></td>
                <td>${api.name}</td>
                <td>${api.endpoint}</td>
                <td>${api.method}</td>
                <td>${detailAltHtml.length === 0 
                    ? `<a class="btn-sm btn-info" title="No Parameters">Details</a>` 
                    : ok 
                    ? `<a class="btn-sm btn-info" title="${detailAltHtml.join(`
`)}">Details</a>` : `<a class="btn-sm btn-warning" title="${detailAltHtml.join(`
`)}">Error</a>`}</td>
            </tr>
            `
        });
    })
}

function selectAll(){
    if (document.getElementById("selectAll").checked){
        document.querySelectorAll("input.apiSelect").forEach((element) => {
            element.checked = "checked"
        })
    } else {
        document.querySelectorAll("input.apiSelect").forEach((element) => {
            element.checked = false
        })
    }
}

function addSelectedApi(){
    const checked = []
    document.querySelectorAll("input.apiSelect").forEach((element) => {
        if (element.checked){
            checked.push(JSON.parse(element.getAttribute("data")))
        }
    })
    if (checked.length === 0){
        alert("No API is selected")
    } else {
        if (confirm(`Are you sure you would like to add ${checked.length} new API endpoint ?`)){
            document.getElementById("apiToAdd").value = JSON.stringify(checked)
            document.getElementById("swaggerForm").submit()
        }
    }
}