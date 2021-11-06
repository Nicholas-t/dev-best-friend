function convertMDToHTML(md){
    var converter = new showdown.Converter()
    return converter.makeHtml(md);
}

function showDashboardContent(projectUid, pageId){
    fetch(`/db/dev/get/page/${projectUid}/${pageId}/dashboard-item-location`).then((data) => {
        return data.json()
    }).then((response) => {
        const itemLocations = {}
        currentLocations = response.result
        currentLocations.forEach(element => {
            itemLocations[element.item_id] = {
                location_x : element.location_x,
                location_y : element.location_y
            }
        });
        document.getElementById("content").innerHTML += `<div id="dashboard-content" style="position:relative;"></div>`
        fetch(`/db/dev/get/page/${projectUid}/${pageId}/dashboard-item`).then((data) => {
            return data.json()
        }).then((response) => {
            const items = response.result
            for (let i = 0 ; i < items.length ; i++){
                const item = items[i]
                fetch(`/db/dev/get/page/${projectUid}/${pageId}/dashboard-item/${item.id}/input`).then((data) => {
                    return data.json()
                }).then((response) => {
                    const input = response.result
                    fetch(`/db/dev/get/page/${projectUid}/${pageId}/dashboard-item/${item.id}/headers`).then((data) => {
                        return data.json()
                    }).then((response) => {
                        const headers = response.result
                        fetch(`/db/dev/get/api/${item.api_id}`).then((data) => {
                            return data.json()
                        }).then((data) => {
                            const api = data.result[0]
                            const _params = {}
                            for (let j = 0 ; j < input.length ; j ++){
                                _params[input[j].key_item] = input[j].value
                            }
                            const _headers = {}
                            for (let j = 0 ; j < headers.length ; j ++){
                                _headers[headers[j].key_item] = headers[j].value
                            }
                            if (Object.keys(itemLocations).includes(item.id)){
                                document.getElementById("dashboard-content").innerHTML += `
<div class="item-active" style="position:absolute;left:${(itemLocations[item.id].location_x-1) * 25}%;top:${(itemLocations[item.id].location_y-1) * 100}px;height:${item.row_id * 100}px;width:${item.width_in_percentage}%;">
    <div class="card" style="height:100%;width:100%;">
        <div class="card-body" style="height:100%;width:100%;">
        <p class="card-title mb-0">${item.name} <small style="font-size: 10px;">${item.description}</small></p>
            <div id="${item.id}" style="height:75%; width:100%;overflow-y:scroll;">
            </div>
        </div>
    </div>
</div>
                                `
                                for (let j = itemLocations[item.id].location_y ; j < itemLocations[item.id].location_y + item.row_id ; j++){
                                    for (let k = itemLocations[item.id].location_x ; k <  itemLocations[item.id].location_x + Number(item.width_in_percentage / 25); k++){
                                        unavailableDropSlot.push(`${j}-${k}`)
                                    }
                                }
                                createRequest(api.method, api.endpoint, api.output_type, 
                                    userId, item.api_id, projectUid, devId, item.id, _params, false, _headers)
                            } else {
                                dashboardItems.push({
                                    method : api.method,
                                    endpoint : api.endpoint,
                                    output_type : api.output_type,
                                    user_id : userId,
                                    api_id: item.api_id,
                                    project_uid : projectUid,
                                    dev_id : devId,
                                    item_id : item.id,
                                    params : _params,
                                    headers : _headers,
                                    row_id : item.row_id,
                                    width_in_percentage : item.width_in_percentage
                                })
                            }
                        })
                    })
                })
            }
        })
        if (admin){
            document.getElementById("admin-section").innerHTML = `
            <div id="settings-trigger">
                <i class="ti-settings"></i>
            </div>
            `
            document.getElementById("settings-trigger").onclick = (() => {showDashboardEditor(projectUid, pageId)})
        }
    })
}
 
let dashboardItems = []
let unavailableDropSlot = []
let currentLocations = []
function fillContent(type, projectUid, pageId, userId, devId){
    if (type === "docs"){
        fetch(`/db/dev/get/page/${projectUid}/${pageId}/md`).then((data) => {
            return data.json()
        }).then((data) => {
            const content = convertMDToHTML(data.content)
            document.getElementById("content").innerHTML = content
        })
    } else if (type === "playground"){
        fetch(`/db/dev/get/page/${projectUid}/${pageId}/input`).then((data) => {
            return data.json()
        }).then((inputData) => {
            fetch(`/db/dev/get/page/${projectUid}/${pageId}/api`).then((data) => {
                return data.json()
            }).then((apiData) => {
                fetch(`/db/dev/get/page/${projectUid}/${pageId}/headers`).then((data) => {
                    return data.json()
                }).then((headersData) => {
                    console.log(headersData)
                    let apiId = apiData.result[0].api_id
                    let headerForm = ``
                    let inputForm = ``
                    for (let i = 0 ; i < inputData.result.length; i++){
                        const input = inputData.result[i]
                        inputForm += `
                            <div class="form-group">
                            <label>${input.label}</label>
                            <input type="${input.type}" name="${input.name}" class="form-input form-control">
                            </div>`
                    }
                    for (let i = 0 ; i < headersData.result.length; i++){
                        const header = headersData.result[i]
                        headerForm += `
                            <div class="form-group">
                            <label>${header.key_header} (<strong>headers</strong>)</label>
                            <input type="text" name="header-${header.key_header}" class="form-headers form-control">
                            </div>`
                    }
                    
                    const formHtml = `
                    <form class="forms-sample" id="playground-form">
                    ${inputForm}
                    ${headerForm === '' ? "" : `<hr> ${headerForm}`}
                    </form>
                    `
                    fetch(`/db/dev/get/api/${apiId}`).then((data) => {
                        return data.json()
                    }).then((data) => {
                        const playgroundHtml = `
                        <div class="row">
                            <div class="col-md-6 grid-margin stretch-card">
                                <div class="card">
                                    <div class="card-body">
                                    <h4 class="card-title">${data.result[0].name}</h4>
                                    <p class="card-description">
                                        Method : <strong>${data.result[0].method}</strong> <br>
                                        Endpoint : <strong>${data.result[0].endpoint}</strong> <br>
                                        Output : <strong>${data.result[0].output_type}</strong> 
                                    </p>
                                    ${formHtml}
                                    <button class="btn btn-primary" onclick="createRequest('${data.result[0].method}','${data.result[0].endpoint}','${data.result[0].output_type}', '${userId}', '${apiId}', '${projectUid}', '${devId}', 'api_output')">Send API Request</button>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 grid-margin stretch-card">
                            
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="card-title">API Output</h4>
                                        <div class="card" id="api_output">
                                            <p style="margin: auto;">No Data</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
                        document.getElementById("content").innerHTML = playgroundHtml
                    })
                })
            })
        })
    } else if (type === "dashboard"){
        showDashboardContent(projectUid, pageId)
    }
}