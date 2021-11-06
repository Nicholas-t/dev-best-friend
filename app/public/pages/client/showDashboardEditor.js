
var nRowOver = 0
var nColOver = 0
var selectedId = ""
var allowPut = true
function selectItem(itemId, row, col){
    let i = document.getElementById(itemId)
    i.style.opacity = '0.4';
    nRowOver = row
    nColOver = col
    selectedId = itemId.replace("item-", "")
    document.onmousemove = fillHover;
    document.getElementById("cancel-section").innerHTML = `
    <button onclick="cancelHover()" class="btn btn-large btn-warning">
        Cancel
    </button>`
}

function cancelHover(){
    location.reload();
}
function fillHover(event) {
    document.querySelectorAll(".drop-zone").forEach(function (item) {
        item.onmouseover = function () {
            document.querySelectorAll(".over").forEach(function (_item) {
                _item.style.backgroundColor = "transparent";
                _item.classList.remove('over');
            });
            let thisRow = Number(item.getAttribute("id").split("-")[2])
            let thisCol = Number(item.getAttribute("id").split("-")[3])
            allowPut = true
            let rowAdded = []
            let colAdded = []
            for (let i = 0 ; i < nRowOver ; i++){
                for (let j = 0 ; j < nColOver ; j++){
                    let _item = document.getElementById(`drop-zone-${thisRow + i}-${thisCol + j}`)
                    if (!_item || unavailableDropSlot.includes(`${thisRow + i}-${thisCol + j}`)){
                        allowPut = false
                        break
                    } else {
                        _item.style.backgroundColor = "#6877b973";
                        _item.classList.add('over');
                        rowAdded.push(thisRow + i)
                        colAdded.push(thisCol + j)
                    }
                }
            }
            if (!allowPut){
                for (let i = 0 ; i < nRowOver ; i++){
                    for (let j = 0 ; j < nColOver ; j++){
                        let _item = document.getElementById(`drop-zone-${thisRow + i}-${thisCol + j}`)
                        if (_item){
                            _item.style.backgroundColor = "#e64f4fd8";
                        }
                    }
                }
            }
        }
    })
    document.onclick = dropHover
}

function dropHover(event) {
    if (allowPut) {
        let item = document.querySelectorAll(".over")[0]
        const minRow = item.getAttribute("id").split("-")[2]
        const minCol = item.getAttribute("id").split("-")[3]
        currentLocations.push(
            {
                item_id : selectedId,
                location_y :  minRow,
                location_x : minCol,
                page_id : pageId
            }
        )
        document.getElementById("dashboard-config").value = JSON.stringify(
            currentLocations
        )
        document.getElementById("dashboard-modify-form").submit()
    } else {
        alert("Oops position is invalid!")
    }
}

function removeAllItems(){
    if (confirm("Are you sure you want to remove all placed items ?")){
        document.getElementById("dashboard-config").value = JSON.stringify(
            []
        )
        document.getElementById("dashboard-modify-form").submit()
    }
}

function setTables(row){
    for (let i = 1 ; i < row ; i++){
        document.getElementById("content").innerHTML += `
        <div class="row">
            <div class="drop-zone${unavailableDropSlot.includes(`${i}-1`) ? " inactive" : ""}" id="drop-zone-${i}-1" style="width: 25%; height: 100px;"> (${i}, 1) </div>
            <div class="drop-zone${unavailableDropSlot.includes(`${i}-2`) ? " inactive" : ""}" id="drop-zone-${i}-2" style="width: 25%; height: 100px;"> (${i}, 2) </div>
            <div class="drop-zone${unavailableDropSlot.includes(`${i}-3`) ? " inactive" : ""}" id="drop-zone-${i}-3" style="width: 25%; height: 100px;"> (${i}, 3) </div>
            <div class="drop-zone${unavailableDropSlot.includes(`${i}-4`) ? " inactive" : ""}" id="drop-zone-${i}-4" style="width: 25%; height: 100px;"> (${i}, 4) </div>
        </div>
        `
    }
}

function removeDashboardEditor(projectUid, pageId){
    document.getElementById("dashboard-items-section-container").innerHTML = ""
    document.getElementById("content").innerHTML = ""
    showDashboardContent(projectUid, pageId)
}

function showDashboardEditor(projectUid, pageId){
    setTables(5)
    
    document.getElementById("admin-section").innerHTML = `
    <div id="settings-trigger">
        <i class="ti-close"></i>
    </div>
    `
    document.getElementById("settings-trigger").onclick = (() => {removeDashboardEditor(projectUid, pageId)})
    document.querySelectorAll(".item-active").forEach((element) => {
        element.remove()
    })
    document.getElementById("dashboard-items-section-container").innerHTML = `
    <form style="display:none;" id="dashboard-modify-form" action="/db/dev/edit/page/${projectUid}/${pageId}/dashboard-item/location" method="POST">
        <input id="dashboard-config" name="config" type="hidden">
        <input name="path" value="${pagePath}" type="hidden">
    </form>
    <div id="dashboard-items-section" class="col-md-9 grid-margin stretch-card">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">Drag items from here</h4>
          <div id="dashboard-items-to-drag">
            <div class="row">
                <button onclick="removeAllItems()" class="btn btn-large btn-danger">
                    Remove All
                </button>
                <div id="cancel-section" style="margin-left:10px;">
                </div>
            </div>
          <br>
          <br>
          </div>
        </div>
      </div>
    </div>`
      
    dashboardItems.forEach((item) => {
        document.getElementById("dashboard-items-to-drag").innerHTML += `
        <div id="item-${item.item_id}" onclick="selectItem('item-${item.item_id}', ${item.row_id}, ${Number(item.width_in_percentage / 25)})" style="border-color:${item.color};">
        </div>
        `
        createRequest(item.method, item.endpoint, item.output_type, 
            item.user_id, item.api_id, item.project_uid, item.dev_id, `item-${item.item_id}`, item.params, false, item.headers)
    })
}