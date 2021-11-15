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
                        <p class="mb-0">${(clientCreditData[planApi.api_id])} Credits</p>
                    </div>
                    <hr>
                    `
                })
            }
        })
    })
}