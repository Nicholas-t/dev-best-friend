function formatDigit(int){
    if (int.toString().length == 1){
        return `0${int}`
    } else {
        return `${int}`
    }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

var areaOptions = {
    plugins: {
        filler: {
            propagate: true
        }
    },
    legend: {
        display: false
    },
    scales: {
        yAxes: [{
            ticks: {
                suggestedMax: 20
            }
        }]
    }
}

function fillHome(uid, planId, userId, devId){
    fetch(`/db/dev/get/plan/${uid}/${planId}`).then((data) => {
        return data.json()
    }).then((data) => {
        const planDetail = data.result[0]
        document.getElementById("plan_name").innerHTML = planDetail.label
    })
    
    fetch(`/db/dev/get/users/credit`).then((data) => {
        return data.json()
    }).then((data) => {
        const clientCreditData = {}
        for (let i = 0 ; i < data.result.length ; i++){
            clientCreditData[data.result[i].api_id] = data.result[i].credit
        }
        fetch(`/db/dev/get/plan/${uid}/${planId}/api`).then((data) => {
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
                    document.getElementById("api-list").innerHTML += `
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
                    <hr>
                    `
                })
            }
        })
    })

    fetch(`/db/dev/get/users/log/${userId}`).then((data) => {
        return data.json()
    }).then(async (response) => {
        let curTimeStamp = Number(new Date()) / 1000
        let data = {}
        let labels = []
        let apiName = {}
        for (let i = 0 ; i < 30 ; i ++){
            let time = new Date((curTimeStamp - (i*60*60*24)) * 1000)
            labels.push(`${time.getDate()}/${time.getMonth()}`)
        }
        for (let i = 0 ; i < response.result.length; i++) {
            let time = new Date(response.result[i].timestamp * 1000)
            if (!data[response.result[i].api_id]) {
                data[response.result[i].api_id] = [
                    0,0,0,0,0,
                    0,0,0,0,0,
                    0,0,0,0,0,
                    0,0,0,0,0,
                    0,0,0,0,0,
                    0,0,0,0,0]
            }
            if (!apiName[response.result[i].api_id]){
                apiName[response.result[i].api_id] = await fetch(`/db/dev/get/api/${response.result[i].api_id}`, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache', 
                    credentials: 'same-origin',
                    redirect: 'follow',
                    referrerPolicy: 'no-referrer'
                }).then((data) => {
                    return data.json()
                }).then((data) => {
                    return data.result[0].name
                })
            }
            data[response.result[i].api_id][labels.indexOf(`${time.getDate()}/${time.getMonth()}`)] += 1
        }
        let datasets = []
        for (let i = 0 ; i < Object.keys(data).length ; i++){
            datasets.push({
                label: apiName[Object.keys(data)[i]],
                data: data[Object.keys(data)[i]].reverse(),
                backgroundColor: [
                    'rgba(245, 247, 255, 0.7)',
                ],
                borderColor: 'black',
                borderWidth: 2,
                fill: true, // 3: no fill
            })
        }
        var areaData = {
            labels: labels.reverse(),
            datasets
        };
        
        var areaChartCanvas = $("#log-chart").get(0).getContext("2d");
        new Chart(areaChartCanvas, {
            type: 'line',
            data: areaData,
            options: areaOptions
        });
    })

    fetch(`/db/client/get/chat/${devId}`).then((data) => {
        return data.json()
    }).then((response) => {
        let chat = response.result.reverse()
        let chatHtml = ``
        let markedUnread = false
        for (let i = 0 ; i < chat.length ; i ++){
            let right = chat[i].from_client
            let unread = !chat[i].from_client && chat[i].unread
            let time  = new Date(chat[i].time_created*1000)
            if (unread && !markedUnread){
                markedUnread = true
                chatHtml += `<small>New message</small><hr></hr>`
            }
            chatHtml += `
            <li class="row${unread ? " unread" : ""}">
                ${right 
                    ? `
                    <div class="col-10">
                        <p style="float: right;" class="text-info mb-1">
                        ${
                            chat[i].client_name
                        } 
                        </p><br>
                        <p style="float: right;" class="mb-0">
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
                            chat[i].client_name
                        }" alt="user">
                    </div>`
                    : `
                    <div class="col-2">
                        <img src="https://eu.ui-avatars.com/api/?name=${
                            chat[i].dev_name
                        }" alt="user">
                    </div>
                    <div class="col-10">
                        <p class="text-info mb-1">
                        ${
                            chat[i].dev_name
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
}