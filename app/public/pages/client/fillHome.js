function fillHome(uid, planId, userId){
    fetch(`/db/dev/get/plan/${uid}/${planId}`).then((data) => {
        return data.json()
    }).then((data) => {
        const planDetail = data.result[0]
        document.getElementById("plan_name").innerHTML = planDetail.label
    })
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
                fetch(`/db/dev/get/users/log/${userId}/${planApi.api_id}`).then((data) => {
                    return data.json()
                }).then((data) => {
                    document.getElementById("api-list").innerHTML += `
                    <p class="text-muted">${apiData.name} <small>(${apiData.endpoint})</small></p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="progress progress-md flex-grow-1 mr-4">
                        <div id="credit-bar-${planApi.api_id}" 
                        class="progress-bar bg-inf0" role="progressbar" 
                        style="width: ${Math.round(data.result.length * 100 / planApi.credit)}%" 
                        aria-valuenow="${Math.round(data.result.length * 100 / planApi.credit)}" 
                        aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <p class="mb-0">${data.result.length} / ${planApi.credit}</p>
                    </div>
                    <hr>
                    `
                })
            })
        }
    })
}