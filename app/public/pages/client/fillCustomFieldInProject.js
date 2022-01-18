function fillCustomFieldInProject(projectUid){
    fetch(`/db/dev/get/custom-field/${projectUid}`).then((data) => {
        return data.json()
    }).then((data) => {
        const customField = data.result
        if (customField.length !== 0) {
            document.getElementById("custom-field-list").innerHTML = ''
        }
        for (let i = 0 ; i < customField.length ; i ++){
            document.getElementById("custom-field-list").innerHTML += `
            <tr>
                <td class="pl-0">
                    ${customField[i].name}
                </td>
                <td class="pl-0">
                    ${customField[i].type}
                </td>
                ${customField[i].required
                ? `<td class="font-weight-medium"><div class="badge badge-info">Required</div></td>`
                : `<td class="font-weight-medium"><div class="badge badge-primary">Not Required</div></td>`}
                <td class="pl-0">
                    <a class="move-up-on-hover btn-sm btn-info" href="/p/${projectUid}/crm/modify/${customField[i].id}">View</a>
                </td>
            </tr>`
        }
    })
}