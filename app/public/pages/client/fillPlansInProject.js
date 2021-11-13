function fillPlansInProject(projectUid){
    fetch(`/db/dev/get/plan/${projectUid}`).then((data) => {
        return data.json()
    }).then((response) => {
        const plans = response.result
        if (plans.length !== 0) {
            document.getElementById("plans-list").innerHTML = ''
        }
        for (let i = 0 ; i < plans.length ; i ++){
            document.getElementById("plans-list").innerHTML += `
            <tr>
                <td class="pl-0">
                    ${plans[i].label}
                </td>
                <td class="pl-0">
                    0
                </td>
                <td class="pl-0">
                    ${plans[i].price == 0 ? "Freemium" : `${plans[i].price} €`}
                </td>
                <td class="pl-0">
                    <a href="/p/${projectUid}/manage/modify/plan/${plans[i].id}">View / Modify</a>
                </td>
            </tr>`
        }
    })
}
