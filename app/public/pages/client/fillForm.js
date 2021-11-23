let l = 1
let k = 1
let apiInputType = []
let apiOptions
let widthOptions = [25, 50, 75, 100]

function deleteDashboardItemInput(row, k){
    document.getElementById(`dashboard-item-${row}-input-${k}`).remove()
}
function deleteDashboardItemHeader(row, k){
    document.getElementById(`dashboard-item-${row}-header-${k}`).remove()
}


function removeItem(n){
    document.getElementById(`parent-item-${n}`).remove()
}

function addDashboardInput(row, itemInput){
    let d = `
    <div id="dashboard-item-${row}-input-${k}" class="row">
        <div class="form-group col-4">
            <label>Key</label>
            <input ${itemInput ? `value="${itemInput.key_item}"`: ""} required type="text" class="form-control" id="key-${row}-${k}" name="key-${row}-${k}" placeholder="Key">
        </div>
        <div class="form-group col-4">
            <label>Value</label>
            <input ${itemInput ? `value="${itemInput.value}"`: ""} required type="text" class="form-control" id="value-${row}-${k}" name="value-${row}-${k}" placeholder="Value">
        </div>
        <div class="form-group col-1">
            <div onclick="deleteDashboardItemInput(${row}, ${k})" class="btn btn-warning" style="margin-top:30px;">
                Remove
            </div>
        <div>
    </div>
    `
    k += 1
    let itemInputs = document.querySelectorAll(`div[id^="dashboard-item-${row}-input-"]`)
    if (!itemInputs.length) {
        document.getElementById(`item-${row}-input`).innerHTML += d;
    } else {
        itemInputs[itemInputs.length-1].insertAdjacentHTML("afterend",d);
    }
}
function addDashboardHeader(row, itemHeader){
    let d = `
    <div id="dashboard-item-${row}-header-${k}" class="row">
        <div class="form-group col-4">
            <label>Header's Key</label>
            <input ${itemHeader ? `value="${itemHeader.key_item}"`: ""} required type="text" class="form-control" id="key-headers-${row}-${k}" name="key-headers-${row}-${k}" placeholder="Key">
        </div>
        <div class="form-group col-4">
            <label>Header's Value</label>
            <input ${itemHeader ? `value="${itemHeader.value}"`: ""} required type="text" class="form-control" id="value-headers-${row}-${k}" name="value-headers-${row}-${k}" placeholder="Value">
        </div>
        <div class="form-group col-1">
            <div onclick="deleteDashboardItemHeader(${row}, ${k})" class="btn btn-warning" style="margin-top:30px;">
                Remove
            </div>
        <div>
    </div>
    `
    k += 1
    let itemHeaders = document.querySelectorAll(`div[id^="dashboard-item-${row}-header-"]`)
    if (!itemHeaders.length) {
        document.getElementById(`item-${row}-header`).innerHTML += d;
    } else {
        itemHeaders[itemHeaders.length-1].insertAdjacentHTML("afterend",d);
    }
}


function addNewItem(item){
    let apiListForm = `<option value=''>Select an API</option>`
    let widthListForm = ``
    for (let i = 0 ; i < apiOptions.length ; i++){
        apiListForm += `<option ${
            item 
            ? item.api_id === apiOptions[i].id
                ? "selected" : ""
            : ""
        } value="${apiOptions[i].id}">${apiOptions[i].name} (${apiOptions[i].endpoint})</option>`
    }
    for (let i = 0 ; i < widthOptions.length ; i++){
        widthListForm += `<option ${
            item 
            ? item.width_in_percentage === widthOptions[i]
                ? "selected" : ""
            : ""
        } value="${widthOptions[i]}">${widthOptions[i]} %</option>`
    }
    let d = `
    <div class="form-group">
        <div id="parent-item-${l}">
            <div class="row">
                ${item 
                    ? `<input value="${item.id}" type="hidden" id="id-${l}" name="id-${l}">`
                    : ""}

                <div class="form-group col-3">
                    <label>Name</label>
                    <input ${item ? `value="${item.name}"`: ""} required type="text" class="form-control" id="name-${l}" name="name-${l}" placeholder="Name">
                </div>
                <div class="form-group col-9">
                    <label>Description</label>
                    <input ${item ? `value="${item.description}"`: ""} required type="text" class="form-control" id="description-${l}" name="description-${l}" placeholder="Short Description">
                </div>
                <div class="form-group col-4">
                    <label>Row</label>
                    <input min="1" ${item ? `value="${item.row_id}"`: ""} required type="number" class="form-control" id="row-${l}" name="row-${l}">
                </div>
                <div class="form-group col-4">
                    <label>Width</label>
                    <select id="width-${l}" name="width-${l}" class="form-control">
                        ${widthListForm}
                    </select>
                </div>
                <div class="form-group col-4">
                    <label>Color</label>
                    <input ${item ? `value="${item.color}"`: ""} required type="color" class="form-control" id="color-${l}" name="color-${l}">
                </div>
                <div class="form-group col-12">
                    <label>API</label>
                    <select id="api-${l}" name="api-${l}" class="form-control">
                        ${apiListForm}
                    </select>
                </div>
            </div>
            <div id="item-${l}-input">
            </div>
            <div id="item-${l}-header">
            </div>
            
            <div class="row">
                <div class="form-group col-3">
                    <a onclick="addDashboardInput(${l})" class="btn btn-info mr-2">Add input for this item</a>
                </div>
                <div class="form-group col-3">
                    <a onclick="addDashboardHeader(${l})" class="btn btn-warning mr-2">Add header</a>
                </div>
                <div class="form-group col-3">
                    <a onclick="removeItem(${l})" class="btn btn-danger mr-2">Remove</a>
                </div>
            </div>
            <hr>
        </div>
    </div>
    `
    if (item) {
        let currentRow = l
        fetch(`/db/dev/get/page/${uid}/${pageId}/dashboard-item/${item.id}/input`).then((data) => {
            return data.json()
        }).then((response) => {
            for (let j = 0 ; j < response.result.length ; j ++){
                addDashboardInput(currentRow, response.result[j])
            }
        })
        fetch(`/db/dev/get/page/${uid}/${pageId}/dashboard-item/${item.id}/headers`).then((data) => {
            return data.json()
        }).then((response) => {
            for (let j = 0 ; j < response.result.length ; j ++){
                addDashboardHeader(currentRow, response.result[j])
            }
        })
    }
    let items = document.querySelectorAll(`div[id^="parent-item"]`)
    if (!items.length) {
        document.getElementById(`dashboard-item-container`).innerHTML += d;
    } else {
        items[items.length-1].insertAdjacentHTML("afterend",d);
    }
    l += 1
}

function addNewInput(input){
    let apiInputTypeForm = ``
    for (let i = 0 ; i < apiInputType.length ;i++){
        apiInputTypeForm += `<option ${
            input 
            ? input.type === apiInputType[i] 
                ? "selected" : ""
            : ""
        } value="${apiInputType[i]}">${apiInputType[i]}</option>`
    }
    let d = `
    <div id="input-${l}">
        <div class="row">
            <div class="form-group col-6">
                <label>Key</label>
                <input ${input ? `value="${input.name}"`: ""} required type="text" class="form-control" id="key-${l}" name="key-${l}" placeholder="Key">
            </div>
            <div class="form-group col-6">
                <label>Label</label>
                <input ${input ? `value="${input.label}"`: ""} required type="text" class="form-control" id="label-${l}" name="label-${l}" placeholder="Label">
            </div>
            <div class="form-group col-9">
                <label>Type</label>
                <select id="type-of-value-${l}" name="type-of-value-${l}" class="form-control">
                  ${apiInputTypeForm}
                </select>
            </div>
            
            <div class="form-group col-3">
                <a onclick="removeInput(${l})" class="btn btn-danger mr-2" style="margin-top:30px;">Remove</a>
            </div>
        </div>
    </div>
    `
    l += 1
    let inputs = document.querySelectorAll(`div[id^="input"]`)
    if (!inputs.length) {
        document.getElementById(`playground-input`).innerHTML += d;
    } else {
        inputs[inputs.length-1].insertAdjacentHTML("afterend",d);
    }
}

function addNewHeader(header){
    let d = `
    <div id="header-${l}">
        <div class="row">
            <div class="form-group col-9">
                <label>Key</label>
                <input ${header ? `value="${header.key_header}"`: ""} required type="text" class="form-control" id="key-header-${l}" name="key-header-${l}" placeholder="Key">
            </div>
            <div class="form-group col-3">
                <a onclick="removeHeader(${l})" style="margin-top:30px;" class="btn btn-danger mr-2">Remove</a>
            </div>
        </div>
    </div>
    `
    l += 1
    let headers = document.querySelectorAll(`div[id^="header-"]`)
    if (!headers.length) {
        document.getElementById(`playground-header`).innerHTML += d;
    } else {
        headers[headers.length-1].insertAdjacentHTML("afterend",d);
    }
}

function addBatchItem(type, batchItem){
    let d = `
    <div id="batch-${type}-${l}">
        <div class="row">
            <div class="form-group col-6">
                <label>Key &nbsp;&nbsp;&nbsp; <small>(Column to add in the csv)</small></label>
                <input ${batchItem ? `value="${batchItem.key_item}"`: ""} required type="text" class="form-control" id="key-${type}-${l}" name="key-${type}-${l}" placeholder="Key">
            </div>
            <div class="form-group col-6">
                <label>Label &nbsp;&nbsp;&nbsp; <small>(Short description of the column)</small></label>
                <input ${batchItem ? `value="${batchItem.label}"`: ""} required type="text" class="form-control" id="label-${type}-${l}" name="label-${type}-${l}" placeholder="Label">
            </div>
            <div class="form-group col-6">
                <label>Default value &nbsp;&nbsp;&nbsp; <small>(Optional)</small></label>
                <input ${batchItem ? `value="${batchItem.default_value}"`: ""} type="text" class="form-control" id="default-value-${type}-${l}" name="default-value-${type}-${l}" placeholder="Default Value">
            </div>
            <div class="form-group col-3">
                <a onclick="removeBatchItem('${type}', ${l})" style="margin-top:30px;" class="btn btn-danger mr-2">Remove</a>
            </div>
        </div>
    </div>
    `
    l += 1
    let items = document.querySelectorAll(`div[id^="batch-${type}-"]`)
    if (!items.length) {
        document.getElementById(`batch-${type}`).innerHTML += d;
    } else {
        items[items.length-1].insertAdjacentHTML("afterend",d);
    }
}

function addBatchConfig(batchConfig){
    let apiListForm = `<option value=''>Select an API</option>`
    for (let i = 0 ; i < apiOptions.length ; i++){
        apiListForm += `<option ${
            batchConfig 
            ? batchConfig.api_id === apiOptions[i].id
                ? "selected" : ""
            : ""
        } value="${apiOptions[i].id}">${apiOptions[i].name} (${apiOptions[i].endpoint})</option>`
    }
    document.getElementById(`batch-config`).innerHTML += `
    <div class="row">
        <div class="form-group col-12">
            <label>API</label>
            <select class="form-control" id="api" name="api">${apiListForm}</select>
        </div>
        <div class="form-group col-6">
            <label>Heading</label>
            <input ${batchConfig ? `value="${batchConfig.heading}"`: ""} required type="text" class="form-control" id="heading" name="heading" placeholder="Heading">
        </div>
        <div class="form-group col-6">
            <label>Sub-heading</label>
            <input ${batchConfig ? `value="${batchConfig.subheading}"`: ""} type="text" class="form-control" id="subheading" name="subheading" placeholder="Sub-heading">
        </div>
    </div>
    `
}

function removeInput(n){
    document.getElementById(`input-${n}`).remove()
}

function removeBatchItem(type, n){
    document.getElementById(`batch-${type}-${n}`).remove()
}

function removeHeader(n){
    document.getElementById(`header-${n}`).remove()
}


function _addModifyForm(page, projectUid, pageId){
    if (page.type === "docs"){
        document.getElementById("modify-form").innerHTML = `
        <form action="/db/dev/edit/page/${projectUid}/${pageId}/md" method="POST" class="forms-sample">
            <div class="form-group">
                <label>Page Content &nbsp;&nbsp;&nbsp;&nbsp;<small>in markdown format</small></label>
                <textarea required type="text" name="md" class="form-control" id="md" rows="4"></textarea>
            </div>
            <input type="hidden" name="type" value="${page.type}">
            <button type="submit" class="btn btn-primary mr-2">Save</button>
        </form>`
        fetch(`/db/dev/get/page/${projectUid}/${pageId}/md`).then((data) => {
            return data.json()
        }).then((data) => {
            document.getElementById("md").value = data.content
        })
    } else if (page.type === "external_url"){
        document.getElementById("modify-form").innerHTML = `
        <form action="/db/dev/edit/page/${projectUid}/${pageId}/external-url" method="POST" class="forms-sample">
            <div class="form-group">
                <label>External URL</label>
                <input required type="url" name="external_url" class="form-control" id="external_url" value="${page.external_url}" placeholder="External URL">
            </div>
            <input type="hidden" name="type" value="${page.type}">
            <button type="submit" class="btn btn-primary mr-2">Save</button>
        </form>`
    } else {
        fetch(`/db/dev/get/project/${projectUid}/available-api`).then((data) => {
            return data.json()
        }).then((response) => {
            if (response.available_api){
                apiOptions =  response.available_api
            } else {
                createMessage("No API has been assigned to any available plans", "warning")
                apiOptions = []
            }
            if (page.type === "playground"){
                fetch("/constant/apiInputType").then((data) => {
                    return data.json()
                }).then((data) => {
                    apiInputType = data.api_input_type
                    document.getElementById("modify-form").innerHTML = `
                    <form action="/db/dev/edit/page/${projectUid}/${pageId}/playground" method="POST" class="forms-sample">
                        <div id="playground-input">
                        </div>
                        <input type="hidden" name="type" value="${page.type}">
                        <div onclick="addNewInput()" class="btn btn-success mr-2">Add new input</div>
                        <hr>
                        <div id="playground-header">
                        <label>Headers &nbsp;&nbsp;&nbsp;&nbsp;<small>Add custom headers</small></label>
                        <!--Headers here-->
                        </div>
                        <div onclick="addNewHeader()" class="btn btn-success mr-2">Add new header</div>
                        <hr>
                        <button type="submit" class="btn btn-primary mr-2">Save</button>
                    </form>`
                    fetch(`/db/dev/get/page/${projectUid}/${pageId}/api`).then((data) => {
                        return data.json()
                    }).then((api) => {
                        let apiCurrent = ""
                        if (api.result.length !== 0){
                            apiCurrent = api.result[0].api_id
                        }
                        let apiOptionsHtml = ["<option value=''>Select an API</option>"]
                        for (let i = 0 ; i < apiOptions.length ; i ++){
                            apiOptionsHtml.push(`<option ${apiCurrent === apiOptions[i].id ? "selected" : ""} 
                            value="${apiOptions[i].id}">${apiOptions[i].name} (${apiOptions[i].endpoint})
                            </option>`)
                        }
                        document.getElementById("playground-input").innerHTML += `
                        <div class="form-group">
                            <label>API &nbsp;&nbsp;&nbsp;&nbsp;<small>that will be used by the playground</small></label>
                            <select name="api" id="api" class="form-control">
                                ${apiOptionsHtml.join("")}
                            </select>
                        </div>`
                        fetch(`/db/dev/get/page/${projectUid}/${pageId}/input`).then((data) => {
                            return data.json()
                        }).then((data) => {
                            const result = data.result
                            for (let i = 0 ; i < result.length ; i++){
                                addNewInput(result[i])
                            }
                            if (result.length == 0){
                                addNewInput()
                            }
                        })
                        fetch(`/db/dev/get/page/${projectUid}/${pageId}/headers`).then((data) => {
                            return data.json()
                        }).then((data) => {
                            const result = data.result
                            for (let i = 0 ; i < result.length ; i++){
                                addNewHeader(result[i])
                            }
                            if (result.length == 0){
                                addNewHeader()
                            }
                        })
                    })
                })
            } else if (page.type === "dashboard"){
                document.getElementById("modify-form").innerHTML = `
                <form action="/db/dev/edit/page/${projectUid}/${pageId}/dashboard-item" method="POST" class="forms-sample">
                    <label>Dashboad Item &nbsp;&nbsp;&nbsp;&nbsp;<small>Each dashboard item to be shown in the page and their input</small></label>
                    <div id="dashboard-item-container">
                    </div>
                    <input type="hidden" name="type" value="${page.type}">
                    <button type="submit" class="btn btn-primary mr-2">Save</button>
                    <div onclick="addNewItem()" class="btn btn-success mr-2">Add new item</div>
                </form>`
                fetch(`/db/dev/get/page/${projectUid}/${pageId}/dashboard-item`).then((data) => {
                    return data.json()
                }).then((response) => {
                    if (response.result.length != 0) {
                        for (let i = 0 ; i < response.result.length ; i++){
                            addNewItem(response.result[i])
                        }
                    } else {
                        addNewItem()
                    }
                })
            } else if (page.type === "batch"){
                document.getElementById("modify-form").innerHTML = `
                <form action="/db/dev/edit/page/${projectUid}/${pageId}/batch" method="POST" class="forms-sample">
                    <label>Batch API &nbsp;&nbsp;&nbsp;&nbsp;<small>Pick an API</small></label>
                    <div id="batch-config">
                    </div>
                    <hr>
                    <label>API Inputs &nbsp;&nbsp;&nbsp;&nbsp;<small>expected inputs as columns in the csv</small></label>
                    <div id="batch-input">
                    <!--Input here-->
                    </div>
                    <div onclick="addBatchItem('input')" class="btn btn-success mr-2">Add new input</div>
                    <hr>
                    <div id="batch-header">
                    <label>Headers &nbsp;&nbsp;&nbsp;&nbsp;<small>expected headers as columns in the csv</small></label>
                    <!--Headers here-->
                    </div>
                    <div onclick="addBatchItem('header')" class="btn btn-success mr-2">Add new header</div>
                    <hr>
                    <input type="hidden" name="type" value="${page.type}">
                    <button type="submit" class="btn btn-primary mr-2">Save</button>
                </form>`
                fetch(`/db/dev/get/page/${projectUid}/${pageId}/batch-config`).then((data) => {
                    return data.json()
                }).then((response) => {
                    if (response.result.length != 0){
                        addBatchConfig(response.result[0])
                    } else {
                        addBatchConfig()
                    }
                    fetch(`/db/dev/get/page/${projectUid}/${pageId}/batch-input`).then((data) => {
                        return data.json()
                    }).then((response) => {
                        response.result.forEach((element) => {
                            addBatchItem("input", element)
                        })
                    })
                    fetch(`/db/dev/get/page/${projectUid}/${pageId}/batch-header`).then((data) => {
                        return data.json()
                    }).then((response) => {
                        response.result.forEach((element) => {
                            addBatchItem("header", element)
                        })
                    })
                })
            } 
        })
    }
}



function fillForm(projectUid, pageId){
    fetch("/constant/pageTypes").then((data) => {
        return data.json()
    }).then((response) => {
        let pageTypes = Object.keys(response)
        for (let i = 0 ; i < pageTypes.length ; i++){
            document.getElementById("type").innerHTML += `
            <option value="${pageTypes[i]}">${response[pageTypes[i]].label} - <small>${response[pageTypes[i]].description}</small></option>
            `
        }
        fetch(`/db/dev/get/page/${projectUid}/${pageId}`, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache', 
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        }).then((data) => {
            return data.json()
        }).then((data) => {
            const page = data.result[0]
            document.getElementById("name").value = page.name
            document.getElementById("page_name").innerHTML = page.name
            document.getElementById("path").value = page.path
            document.getElementById("type").value = page.type
            fillIconPage(page.icon)
            _addModifyForm(page, projectUid, pageId)
        })
    })
}

