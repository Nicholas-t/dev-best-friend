function fillUsersInProject(projectUid){
    fetch(`/db/dev/get/plan/${projectUid}`).then((data) => {
        return data.json()
    }).then((response) => {
        const plans = response.result
        const planDetail = {}
        for (let i = 0 ; i < plans.length ; i ++){
            planDetail[plans[i].id] = {
                name: plans[i].label
            }
        }
        const params = new URLSearchParams(window.location.search)
        let link = `/db/dev/get/users/${projectUid}`
        if (params.has("q")){
            link += `?q=${params.get("q")}`
            document.getElementById('name_q').value = params.get("q")
        }
        fetch(link).then((data) => {
            return data.json()
        }).then((response) => {
            const users = response.result
            if (users.length !== 0) {
                document.getElementById("users-list").innerHTML = ''
            }
            for (let i = 0 ; i < users.length ; i ++){
                document.getElementById("users-list").innerHTML += `
                <tr>
                    <td class="pl-0">
                        ${users[i].client_id.slice(0, 5)}....
                    </td>
                    <td class="pl-0">
                        ${users[i].client_email}
                    </td>
                    <td class="pl-0">
                        ${users[i].client_name}
                    </td>
                    <td class="pl-0">
                        ${planDetail[users[i].client_plan_id].name}
                    </td>
                    <td class="pl-0">
                        ${(new Date(users[i].client_time_created * 1000)).toISOString()}
                    </td>
                    <td class="pl-0">
                        <a class="btn-sm btn-info move-up-on-hover" href="/dev/users/view/${users[i].client_id}">View</a>
                    </td>
                </tr>`
            }
        })
    })
}
