function formatDigit(int){
    if (int.toString().length == 1){
        return `0${int}`
    } else {
        return `${int}`
    }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function viewUser(userId){
    fetch(`/db/dev/get/users/view/${userId}`).then((data) => {
        return data.json()
    }).then((response) => {
        const user = response.result[0]
        document.getElementById("activated").value = user.activated == 1 
            ? "TRUE" 
            : "FALSE"
        document.getElementById("email").value = user.email
        document.getElementById("last_seen").value = (new Date(user.last_sign_in * 1000)).toISOString()
        document.getElementById("name").value = user.name
        document.getElementById("plan").value = user.plan_id === "" 
            ? "Not Set Up" 
            : user.plan_id
        document.getElementById("project").innerHTML = `Project : /p/<strong>${user.project_id}</strong>`
        fillCustomField(user.project_id, userId, "dev")
        document.getElementById("time_created").value = (new Date(user.time_created * 1000)).toISOString()
        if (user.plan_id !== ""){
            let planId = user.plan_id
            fetch(`/db/dev/get/users/credit/${userId}`).then((data) => {
                return data.json()
            }).then((data) => {
                const clientCreditData = {}
                for (let i = 0 ; i < data.result.length ; i++){
                    clientCreditData[data.result[i].api_id] = data.result[i].credit
                }
                fetch(`/db/dev/get/plan/${user.project_id}/${planId}/api`).then((data) => {
                    return data.json()
                }).then((data) => {
                    const planApis = data.result
                    for (let i = 0 ; i < planApis.length ; i++){
                        const planApi = planApis[i]
                        fetch(`/db/dev/get/api/${planApi.api_id}`).then((data) => {
                            return data.json()
                        }).then((data) => {
                            const apiData = data.result[0]
                            const width = Math.round((clientCreditData[planApi.api_id]) * 100 / planApi.credit)
                            document.getElementById("available-credit").innerHTML += `
                            <p class="text-muted">${apiData.name} <small>(${apiData.endpoint})</small></p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="progress progress-md flex-grow-1 mr-4">
                                <div id="credit-bar-${planApi.api_id}" 
                                class="progress-bar bg-inf0" role="progressbar" 
                                style="width: ${width}%" 
                                aria-valuenow="${width}" 
                                aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <p class="mb-0">${clientCreditData[planApi.api_id]
                                ? clientCreditData[planApi.api_id]
                                : 0} Credits</p>
                            </div>
                            <br>
                            <div class="row">
                            <p class="text-muted">&nbsp;&nbsp;&nbsp;&nbsp;Give free credits :
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <form class="col-2" action="/db/dev/add/credit/${userId}/${planApi.api_id}/1" method="POST">
                                <button type="submit" class="move-up-on-hover btn btn-rounded btn-sm btn-success">
                                1 + 
                                </button>
                            </form>
                             ${planApi.credit > 50
                              ? `&nbsp;&nbsp;&nbsp;&nbsp;
                              <form class="col-2" action="/db/dev/add/credit/${userId}/${planApi.api_id}/10" method="POST">
                                <button type="submit" class="move-up-on-hover btn btn-rounded btn-sm btn-success">
                                10 + 
                                </button>
                            </form>`
                             : ""}
                             ${planApi.credit > 500
                              ? `&nbsp;&nbsp;&nbsp;&nbsp;
                              <form class="col-3" action="/db/dev/add/credit/${userId}/${planApi.api_id}/100" method="POST">
                                <button type="submit" class="move-up-on-hover btn btn-rounded btn-sm btn-success">
                                100 + 
                                </button>
                            </form>`
                             : ""}
                            </p>  
                            </div>
                            <br>
                            `
                        })
                    }
                })
            })
        }
        fetch(`/db/dev/get/chat/${userId}`).then((data) => {
            return data.json()
        }).then((response) => {
            let chat = response.result.reverse()
            let chatHtml = ``
            let markedUnread = false
            for (let i = 0 ; i < chat.length ; i ++){
                let right = !chat[i].from_client
                let unread = chat[i].from_client && chat[i].unread
                let time  = new Date(chat[i].time_created*1000)
                if (unread && !markedUnread){
                    markedUnread = true
                    chatHtml += `<small>New message</small><hr></hr>`
                }
                chatHtml += `
                <li class="row">
                    ${right 
                        ? `
                        <div class="col-10">
                            <p style="float: right;" class="text-info mb-1">
                            ${
                                chat[i].dev_name
                            }
                            </p><br>
                            <p style="float: right;text-align:right;" class="mb-0">
                            ${
                                chat[i].content.split("\n").join("<br>")
                            }
                            <br>
                            <small style="float: right;" >
                            ${time.getDate()} ${MONTHS[time.getMonth()]} ${
                                formatDigit(time.getHours())
                            }:${
                                formatDigit(time.getMinutes())
                            }
                            </small>
                            </p>
                        </div>
                        <div  class="col-2">
                            <img  style="float: right;" src="https://eu.ui-avatars.com/api/?name=${
                                chat[i].dev_name
                            }" alt="user">
                        </div>`
                        : `
                        <div class="col-2">
                            <img  src="https://eu.ui-avatars.com/api/?name=${
                                chat[i].client_name
                            }" alt="user">
                        </div>
                        <div class="col-10">
                            <p class="text-info mb-1">
                            ${
                                chat[i].client_name
                            }  
                            </p>
                            <p class="mb-0">
                            ${
                                chat[i].content.split("\n").join("</br>")
                            }
                            <br>
                            <small>
                            ${time.getDate()} ${MONTHS[time.getMonth()]} ${
                                formatDigit(time.getHours())
                            }:${
                                formatDigit(time.getMinutes())
                            }
                            </small>
                            </p>
                        </div>`
                    }
                </li>`
                if (unread){
                    fetch(`/db/dev/read/chat/${chat[i].id}`)
                }
            }
            if (chatHtml !== ''){
                document.getElementById("chat").innerHTML = chatHtml
                document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight
            }
        })
    })

    fetch("/db/dev/get/api").then((data) => {
        return data.json()
    }).then((response) => {
        const apiData = {}
        for (let i = 0 ; i < response.result.length ; i++){
            apiData[response.result[i].id] = response.result[i]
        }
        fetch(`/db/dev/get/users/log/${userId}`).then((data) => {
            return data.json()
        }).then((response) => {
            let html = ``
            for (let i = 0 ; i < response.result.length ; i ++){
                html += `
                <tr>
                    <td>${
                        apiData[response.result[i].api_id].endpoint
                    }</td>
                    <td>
                        ${
                            (new Date(response.result[i].timestamp * 1000)).toISOString()
                        }
                    </td>
                    <td class="pl-0">
                    <a class="btn btn-rounded ${
                        response.result[i].status.toString()[0] === "2"
                            ? "btn-success"
                            : response.result[i].status.toString()[0] === "4" || response.result[i].status.toString()[0] === "5"
                                ? "btn-danger"
                                : "btn-warning"
                    }">${response.result[i].status}</a>
                </td>
                </tr>
                `
            }
            if (html !== ""){
                document.getElementById("log-list").innerHTML = html
            }
        })
    })
}