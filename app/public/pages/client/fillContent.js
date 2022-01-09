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
                        fetch(`/db/dev/get/page/${projectUid}/${pageId}/dashboard-item/${item.id}/path-parameter`).then((data) => {
                            return data.json()
                        }).then((response) => {
                            const pathParameter = response.result
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
                                const _pathParameter = {}
                                for (let j = 0 ; j < pathParameter.length ; j ++){
                                    _pathParameter[pathParameter[j].key_item] = pathParameter[j].value
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
                                        userId, item.api_id, projectUid, devId, item.id, _params, false, _headers, _pathParameter)
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
                                        pathParameter : _pathParameter,
                                        row_id : item.row_id,
                                        width_in_percentage : item.width_in_percentage
                                    })
                                }
                            })
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
                    fetch(`/db/dev/get/page/${projectUid}/${pageId}/path-parameter`).then((data) => {
                        return data.json()
                    }).then((pathParameterData) => {
                        let apiId = apiData.result[0].api_id
                        let headerForm = ``
                        let inputForm = ``
                        let pathParameterForm = ``
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
                        for (let i = 0 ; i < pathParameterData.result.length; i++){
                            const pathParameter = pathParameterData.result[i]
                            pathParameterForm += `
                                <div class="form-group">
                                <label>${pathParameter.label} (<strong>path parameter</strong>)</label>
                                <input type="text" name="path-parameter-${pathParameter.name}" class="form-path-parameter form-control">
                                </div>`
                        }
                        
                        const formHtml = `
                        <form class="forms-sample" id="playground-form">
                        ${inputForm}
                        ${headerForm === '' ? "" : `<hr> ${headerForm}`}
                        ${pathParameterForm === '' ? "" : `<hr> ${pathParameterForm}`}
                        </form>
                        `
                        fetch(`/db/dev/get/api/${apiId}`).then((data) => {
                            return data.json()
                        }).then((data) => {
                            if (data.result.length != 0){
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
                                            <button class="move-up-on-hover btn btn-primary" onclick="createRequest('${data.result[0].method}',
                                            '${data.result[0].endpoint}',
                                            '${data.result[0].output_type}', '${userId}', '${apiId}', '${projectUid}', 
                                            '${devId}', 'api_output')">Send API Request</button>
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
                            } else {
                                createMessage("The config of this page has not yet been set up by the developer.", "error")
                            }
                        })
                    })
                })
            })
        })
    } else if (type === "dashboard"){
        showDashboardContent(projectUid, pageId)
    } else if (type === "batch"){
        fetch(`/db/dev/get/page/${projectUid}/${pageId}/batch-config`).then((data) => {
            return data.json()
        }).then((response) => {
            if (response.result.length != 0){
                const batchConfig = response.result[0]
                const batchHtml = `
                <div class="row">
                    <div class="col-md-12 grid-margin stretch-card">
                        <div class="card">
                            <div class="card-body" style="text-align: center;">
                                <div style="font-size: 100px;margin-bottom: 20px;margin-top: 20px;">
                                    <i class="${pageIcon} menu-icon"></i>
                                </div>
                                <div style="font-size: 100px;">
                                    <h2>${batchConfig.heading}</h4>
                                </div>
                                <div>
                                    <p class="card-description">
                                        ${batchConfig.subheading}
                                    </p>
                                </div>
                                <form enctype="multipart/form-data" action="/p/${projectUid}/${pagePath}/${pageId}/batch" id="process-file-form" method="POST">
                                    <input onchange="processFile()" id="file-upload" type="file" name="file" accept=".csv" hidden>
                                    <label for="file-upload" class="move-up-on-hover file-upload-browse btn btn-primary" type="button" style="width:50%;">Upload</label>
                                </form>
                                <div id="download_current_sample"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 grid-margin stretch-card">
                        <div class="card">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>
                                        Batch ID
                                        </th>
                                        <th>
                                        Time Uploaded
                                        </th>
                                        <th>
                                        Status
                                        </th>
                                        <th>
                                        View
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="user-batch">
                                <tr>
                                    <td>
                                    </td>
                                    <td>
                                    No Batch Uploaded
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                </div>`
                fetch(`/db/dev/check/is-sample-file-exist/${pageId}`).then((data) => {
                    return data.json()
                }).then((data) => {
                    if (data.exist) {
                        document.getElementById("download_current_sample").href = ``
                        document.getElementById("download_current_sample").innerHTML = `
                        <br>
                        <a class="move-up-on-hover btn btn-success" href="/db/dev/get/batch-sample/${pageId}/download" target="_blank">
                        Download sample file
                        </a>
                        `
                    }
                })
                document.getElementById("content").innerHTML = batchHtml
                fetch(`/constant/batchStatus`).then((data) => {
                    return data.json()
                }).then((data) => {
                    let batchStatus = data
                    fetch(`/db/dev/get/process/${pageId}`).then((data) => {
                        return data.json()
                    }).then((data) => {
                        if (data.length != 0){
                            let htmlBatch = ``
                            for (let i = 0 ; i < data.length; i ++){
                                htmlBatch += `<tr>
                                <td>
                                ${data[i].id}
                                </td>
                                <td>
                                ${(new Date(data[i].time_created * 1000)).toISOString()}
                                </td>
                                <td>
                                <label class="badge badge-${batchStatus[data[i].status].button_type}">
                                ${batchStatus[data[i].status].label}
                                </label>
                                </td>
                                <td>
                                <a href="/p/${projectUid}/${pagePath}/batch/${data[i].id}">View</a>
                                </td>
                            </tr>`
                            }
                            document.getElementById("user-batch").innerHTML = htmlBatch
                        }
                    })
                })
            } else {
                createMessage("The config of this page has not yet been set up by the developer.", "error")
            }
        })
    }
}