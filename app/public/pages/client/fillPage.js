function fillPage(projectUid){
    fetch(`/db/dev/get/page/${projectUid}`).then((data) => {
        return data.json()
    }).then((response) => {
        if (response.result.length !== 0){
            document.getElementById("page-list").innerHTML = ""
        }
        for (let i = 0 ; i < response.result.length ; i ++){
            document.getElementById("page-list").innerHTML += `
            <tr>
                <td class="pl-0">
                    ${response.result[i].path}
                </td>
                <td class="pl-0">
                    ${response.result[i].name}
                </td>
                <td class="pl-0">
                    ${(new Date(response.result[i].time_created * 1000)).toISOString()}
                </td>
                <td class="pl-0">
                    ${response.result[i].type}
                </td>
                <td>
                    <p class="move-up-on-hover mb-0">
                        <a class="btn-sm btn-info" href="/p/${projectUid}/admin/modify/${response.result[i].id}">Modify</a>
                    </p>
                </td>
                <td class="pl-0">
                    <form id="delete-${response.result[i].id}" action="/db/dev/delete/page/${projectUid}/${response.result[i].id}" method="POST">
                        <div class="move-up-on-hover" style="cursor:pointer;" onclick="deleteApi('${response.result[i].id}', '${response.result[i].name}')"><a class="btn-sm btn-danger">Delete</a></div>
                    </form>
                </td>
            </tr>`
        }
    })
}


function deleteApi(pageId, pageName){
    if (confirm(`Are you sure you want to delete the page "${pageName}"`) == true) {
        document.getElementById(`delete-${pageId}`).submit()
    }
}