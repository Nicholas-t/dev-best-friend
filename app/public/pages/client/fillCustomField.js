function fillCustomField(projectUid, userId){
    fetch(`/db/dev/get/custom-field/${projectUid}`).then((data) => {
        return data.json()
    }).then((data) => {
        const customField = data.result
        fetch(`/db/dev/get/custom-field/${projectUid}/${userId}`).then((data) => {
            return data.json()
        }).then((data) => {
            const clientCustomField = data.result
            const customFieldValue = {}
            clientCustomField.forEach((element) => {
                customFieldValue[element.field_id] = element.value
            })
            for (let i = 0 ; i < customField.length ; i ++){
                if (customField[i].type === "picklist"){
                    let optionsHtml = ''
                    customField[i].options.split(",").forEach(element => {
                        optionsHtml += `<option ${element === customFieldValue[customField[i].id] ? "selected" : ""} value="${element}">${element}</option>`
                    });
                    document.getElementById("custom-field").innerHTML += `
                    <label>${customField[i].name}</label>
                    <div class="form-group">
                        <select ${customField[i].required ? "required" : ""} class="form-control" name="custom_${customField[i].id}" id="${customField[i].id}">
                            ${optionsHtml}
                        </select>
                    </div>
                    `
                } else {
                    document.getElementById("custom-field").innerHTML += `
                    <label>${customField[i].name}${customField[i].required ? " <i class='text-danger'>*</i>" : ""}</label>
                    <div class="form-group">
                    <input value="${customFieldValue[customField[i].id]}" ${customField[i].required ? "required" : ""} name="custom_${customField[i].id}" type="${customField[i].type}" class="form-control form-control-lg" id="${customField[i].id}" placeholder="${customField[i].name}">
                    </div>
                    `
                }
            }
        })
    })
}