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

function fillHome(uid, planId, userId){
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
}