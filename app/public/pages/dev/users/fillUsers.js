function fillUsers(){
    const params = new URLSearchParams(window.location.search)
    let link = `/db/dev/get/users`
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
                    ${users[i].project_name}
                    (<i class="mdi mdi-${users[i].project_icon}"></i>)
                </td>
                <td class="pl-0">
                    ${(new Date(users[i].client_time_created * 1000)).toISOString()}
                </td>
                <td class="pl-0">
                    <a class="move-up-on-hover" href="/dev/users/view/${users[i].client_id}">
                    View</a>
                </td>
            </tr>`
        }
    })
}

fillUsers()