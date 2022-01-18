function fetchUserApi(){
    fetch("/db/dev/get/api").then((data) => {
        return data.json()
    }).then((response) => {
        const ids = []
        if (response.result.length !== 0) {
            document.getElementById("api-list").innerHTML = ""
        }
        for (let i = 0 ; i < response.result.length ; i ++){
            document.getElementById("api-list").innerHTML += `
            <tr>
                <td class="pl-0">${response.result[i].name}</td>
                <td class="text-muted">
                    ${response.result[i].endpoint}
                </td>
                <td class="text-muted">
                    ${response.result[i].method}
                </td>
                <td><p class="mb-0"><span id="n-calls-${response.result[i].id}" class="font-weight-bold mr-2">0</span></p></td>
                <td><p class="mb-0"><a class="btn-sm btn-info move-up-on-hover" href="/dev/api/view/${response.result[i].id}"><i class="mdi mdi-lead-pencil"></i> Modify</a></p></td>
                <td><p class="mb-0">
                <form id="delete-${response.result[i].id}" action="/db/dev/delete/api/${response.result[i].id}" method="POST">
                    <div style="cursor:pointer;" onclick="deleteApi('${response.result[i].id}', '${response.result[i].name}')"><a class="move-up-on-hover btn-sm btn-danger"><i class="mdi mdi-delete"></i> Delete</a></div>
                </form>
                </td>
            </tr>`
            ids.push(response.result[i].id)
        }
        for (let i = 0; i < ids.length ; i++){
            fetch(`/db/dev/get/log/${ids[i]}/n`).then((data) => {
                return data.json()
            }).then((n) => {
                document.getElementById(`n-calls-${response.result[i].id}`).innerHTML = n.result[0].count
            })
        }
    })
}

function deleteApi(apiId, apiName){
    if (confirm(`Are you sure you want to delete "${apiName}"`) == true) {
        document.getElementById(`delete-${apiId}`).submit()
    }
}

fetchUserApi()