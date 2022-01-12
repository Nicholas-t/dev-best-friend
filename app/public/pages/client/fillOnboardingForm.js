function fillOnboardingForm(projectUid){
    fetch(`/db/dev/get/custom-field/${projectUid}`).then((data) => {
        return data.json()
    }).then((data) => {
        const customField = data.result
        if (customField.length === 0) {
            window.location.href = `/p/${projectUid}/home`
        } else {
            for (let i = 0 ; i < customField.length ; i ++){
                if (customField[i].type === "picklist"){
                    let optionsHtml = ''
                    customField[i].options.split(",").forEach(element => {
                        optionsHtml += `<option value="${element}">${element}</option>`
                    });
                    document.getElementById("custom-field").innerHTML += `
                    <label>${customField[i].name}</label>
                    <div class="form-group">
                        <select ${customField[i].required ? "required" : ""} class="form-control" name="${customField[i].id}" id="${customField[i].id}">
                            ${optionsHtml}
                        </select>
                    </div>
                    `
                } else {
                    document.getElementById("custom-field").innerHTML += `
                    <label>${customField[i].name}${customField[i].required ? " <i class='text-danger'>*</i>" : ""}</label>
                    <div class="form-group">
                      <input ${customField[i].required ? "required" : ""} name="${customField[i].id}" type="${customField[i].type}" class="form-control form-control-lg" id="${customField[i].id}" placeholder="${customField[i].name}">
                    </div>
                    `
                }
            }
            document.getElementById("custom-field").innerHTML += `
            <div class="mt-3">
                <button class="move-up-on-hover btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" type="submit">Submit</button>
            </div>
            `
        }
    })
}