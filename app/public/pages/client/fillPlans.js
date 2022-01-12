function fillPlansInProject(projectUid){
    fetch(`/db/dev/get/plan/${projectUid}`).then((data) => {
        return data.json()
    }).then((response) => {
        const plans = response.result
        if (plans.length !== 0) {
            document.getElementById("plans-list").innerHTML = ''
        }
        const planDetail = {}
        for (let i = 0 ; i < plans.length ; i ++){
            document.getElementById("plans-list").innerHTML += `
            <tr>
                <td class="pl-0">
                    ${plans[i].label}
                </td>
                <td id="${plans[i].id}-nuser" class="pl-0">
                    0
                </td>
                <td class="pl-0">
                    ${plans[i].price == 0 ? "Freemium" : `${plans[i].price} €`}
                </td>
                <td class="pl-0">
                    <a href="/p/${projectUid}/manage/modify/plan/${plans[i].id}">View / Modify</a>
                </td>
            </tr>`
            planDetail[plans[i].id] = {
                name: plans[i].label,
                nUser : 0
            }
        }
        fetch(`/db/dev/get/users/${projectUid}`).then((data) => {
            return data.json()
        }).then((response) => {
            const users = response.result
            for (let i = 0 ; i < users.length ; i ++){
                planDetail[users[i].client_plan_id].nUser += 1
            }
            let keys = Object.keys(planDetail)
            keys.forEach((key) => {
                document.getElementById(`${key}-nuser`).innerHTML = planDetail[key].nUser
            })
        })
    })
}
