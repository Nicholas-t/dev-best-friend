let curPage = 0

function fillLog(){
    fetch(`/db/dev/get/log?offset=${curPage * 10}&n=${10}`).then((data) => {
        return data.json()
    }).then((response) => {
        const logs = response.result
        if (logs.length !== 0 && curPage === 0) {
            document.getElementById("log-list").innerHTML = ''
        }
        for (let i = 0 ; i < logs.length ; i ++){
            document.getElementById("log-list").innerHTML += `
            <tr>
                <td class="pl-0">
                    ${logs[i].api_name}
                </td>
                <td class="text-muted">
                    ${logs[i].api_endpoint}
                </td>
                <td class="pl-0">
                    ${logs[i].project_name}
                    (<i class="mdi mdi-${logs[i].project_icon}"></i>)
                </td>
                <td class="pl-0">
                    ${(new Date(logs[i].timestamp * 1000)).toISOString()}
                </td>
                <td class="pl-0">
                    <a class="btn btn-rounded ${
                        logs[i].status.toString()[0] === "2"
                            ? "btn-success"
                            : logs[i].status.toString()[0] === "4" || logs[i].status.toString()[0] === "5"
                                ? "btn-danger"
                                : "btn-warning"
                    }">${logs[i].status}</a>
                </td>
            </tr>`
        }
    })
}

function showNextLog(){
    curPage ++
    fillLog()
}
fillLog()