let k = 0
let apiList = []
function addItemPlan(itemPlan){
    let apiOptions = []
    for (let i = 0 ; i < apiList.length ; i++){
        apiOptions.push(`<option ${itemPlan 
            ? itemPlan.api_id === apiList[i].id 
                ? "selected" : ""
            : ""} value="${apiList[i].id}">${apiList[i].name} (${apiList[i].endpoint})</option>`)
    }
    let d = `
    <div id="item-${k}" class="row">
        <div class="form-group col-6">
            <label>API</label>
            <select name="api-${k}" id="api-${k}" class="form-control">
                ${apiOptions.join("")}
            </select>
        </div>
        ${
            itemPlan 
            ? `<input type="hidden" class="form-control" value="${itemPlan.id}" name="id-${k}">`
            : ``
        }
        <div class="form-group col-6">
            <label>Monthly Limit</label>
            <input min=1 ${itemPlan ? `value="${itemPlan.credit}"`: ""} required type="number" class="form-control" id="limit-${k}" name="limit-${k}">
        </div>
        <div class="form-group col-9">
            <label>Description &nbsp;&nbsp;&nbsp; <small>What will be shown in the pricing page</small></label>
            <input ${itemPlan ? `value="${itemPlan.description}"`: ""} type="text" class="form-control" id="description-${k}" name="description-${k}">
        </div>
        <div class="form-group col-3">
            <div onclick="deleteItemPlan(${k})" class="move-up-on-hover btn btn-warning" style="margin-top:30px;">
                Remove
            </div>
        <div>
    </div>
    `
    k += 1
    let itemPlans = document.querySelectorAll(`div[id^="item-"]`)
    if (!itemPlans.length) {
        document.getElementById(`modify-form`).innerHTML += d;
    } else {
        itemPlans[itemPlans.length-1].insertAdjacentHTML("afterend",d);
    }
}

function deleteItemPlan(r){
    document.getElementById(`item-${r}`).remove()
}

fetch("/db/dev/get/api").then((data) => {
    return data.json()
}).then((response) => {
    apiList = response.result
    if (apiList.length == 0){
        createMessage("No API has been defined. Please define your API in the 'My API' section", "error")
    }
    fetch(`/db/dev/get/plan/${uid}/${planId}/api`).then((data) => {
        return data.json()
    }).then((response) => {
        if (response.result.length) {
            for (let i = 0 ; i < response.result.length ; i++){
                addItemPlan(response.result[i])
            }
        } else {
            addItemPlan()
        }
    })
})