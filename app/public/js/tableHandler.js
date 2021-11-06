

function createTable(config){
    const headers = getTableHeaders(config.keys)
    const rows = getTableRows(config.values, headers.keysList, headers.keysType)
    return `
    <div class="table-responsive">
        <table class="table ${getTableClass(config.style)}">
            <thead>
            ${headers.html}
            </thead>
            <tbody>
            ${rows}
            </tbody>
        </table>
    </div>
`
}

function getTableHeaders(keys){
    const keysList = []
    const keysType = []
    const keysLabel = []
    for(let i = 0 ; i < keys.length ; i++){
        keysList.push(keys[i].key)
        keysLabel.push(keys[i].label ? keys[i].label : keys[i].key)
        keysType.push(keys[i].type)
    }
    const html = `<tr><th>${keysLabel.join("</th><th>")}</th></tr>`
    return {keysList, keysType, html}
}

function getTableRows(values, keysList, keysType){
    const rowsHtml = []
    for (let i = 0 ; i < values.length ; i++){
        const row = []
        for (let j = 0 ; j < keysList.length ; j++){
            row.push(getCell(values[i][keysList[j]], keysType[j]))
        }
        rowsHtml.push(row.join(""))
    }
    return `<tr>${rowsHtml.join("</tr><tr>")}</tr>`
}

// style : hover, striped, border, dark
function getTableClass(style){
    if (style == "hover") {
        return "table-hover"
    } else if (style == "striped") {
        return "table-striped"
    } else if (style == "border") {
        return "table-bordered"
    } else if (style == "dark") {
        return "table-dark"
    } else {
        return ""
    }
}

// type : image, pill, progress-bar
function getCell(value, type){
    if (!value){
        return `<td></td>`
    }
    if (type == "image"){
        return `
        <td class="py-1">
            <img src="${value}" alt="image">
        </td>`
    } else if (type == "pill"){
        return `
        <td>
            <label class="badge badge-${
                value.color == "green" 
                ? "success"
                : value.color == "yellow"
                ? "warning"
                : value.color == "blue"
                ? "info"
                : value.color == "purple"
                ? "primary"
                : value.color == "black"
                ? "dark"
                : value.color == "grey"
                ? "secondary"
                : "light"
            }">${value.value}</label>
        </td>`
    }else if (type == "progress-bar"){
        return `
        <td>
            <div class="progress">
                <div class="progress-bar bg-primary" role="progressbar" style="width: ${value}%" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        </td>`
    } else {
        return `<td>${value}</td>`
    }
}