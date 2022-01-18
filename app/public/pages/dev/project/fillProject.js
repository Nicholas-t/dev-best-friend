function fillLog(){
    fetch(`/db/dev/get/project`).then((data) => {
        return data.json()
    }).then((response) => {
        const ids = []
        if (response.result.length != 0){
            document.getElementById("api-list").innerHTML = ""
        }
        for (let i = 0 ; i < response.result.length ; i ++){
            document.getElementById("api-list").innerHTML += `
            <tr>
                <td class="text-muted">${response.result[i].uid}</td>
                <td class="pl-0">
                    ${response.result[i].name}
                </td>
                <td class="pl-0">
                    <p class="mb-0">
                        ${response.result[i].description}
                    </p>
                </td>
                <td class="pl-0">
                    ${(new Date(response.result[i].time_created * 1000)).toISOString() }
                </td>
                <td><p class="mb-0 move-up-on-hover"><a class="btn-sm btn-info" href="/p/${response.result[i].uid}/admin"><i class="mdi mdi-account-key"></i> Admin View</a></p></td>
            </tr>`
            ids.push(response.result[i].id)
        }
    })
}

fillLog()