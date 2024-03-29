fetch(`/db/dev/get/plan/${uid}`).then((data) => {
    return data.json()
}).then((response) => {
    const plans = response.result
    for (let i = 0 ; i < plans.length ; i++){
        document.getElementById("plan-list").innerHTML += `
        <div class="col-${12 / plans.length} grid-margin stretch-card">
            <div class="card">
                <div class="card-body row">
                <div style="text-align: center;" class="col-md-12 d-flex flex-column justify-content-start">
                    <p class="card-title">Plan #${i + 1}</p>
                    <h1 class="text-primary">${plans[i].price}€<small style="font-size: small;"> / month</small></h1>
                    <h3 class="font-weight-500 mb-xl-4 text-primary">${plans[i].label}</h3>
                    <p>${plans[i].description}</p>
                    <div id="plan-item-${plans[i].id}" class="table-responsive mb-3 mb-md-0 mt-3">
                    </div>
                </div>
                </div>
                ${plans[i].id === currentPlanId
                ?  `
                <div class="move-up-on-hover btn btn-warning">
                    Current Plan
                </div>
                `
                : `
                <div onclick="choosePlan('${plans[i].id}', ${plans[i].price})" class="move-up-on-hover btn btn-primary">
                    Choose Plan
                </div>
                `}
            </div>
        </div>
        `
        fetch(`/db/dev/get/plan/${uid}/${plans[i].id}/api`).then((data) => {
            return data.json()
        }).then((response) => {
            for (let k = 0 ; k < response.result.length ; k++){
                document.getElementById(`plan-item-${plans[i].id}`).innerHTML += `
                <hr>
                <p> <i class="mdi mdi-check"></i> ${response.result[k].description}</p>
                `
            }
        })
    }
})
        
function choosePlan(planId, planPrice){
    if (planPrice == 0){
        fetch(`/db/client/edit/plan`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache', 
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer', 
            body: JSON.stringify({
                plan_id : planId
            })
        }).then((data) => {
            return data.json()
        }).then((response) => {
            if (response.success) {
                if (context == "change"){
                    fetch(`/payment/${uid}/plan/unsubscribe/${planId}`, {
                        method: 'POST'
                    }).then((data) => {
                        return data.json()
                    }).then((response) => {
                        if (response.ok){
                            window.location = `/p/${uid}/home`
                        } else {
                            createMessage("Unable to update plan", "error")
                        }
                    })
                } else {
                    window.location = `/p/${uid}/home`
                }
            } else {
                createMessage("Unsuccesful to subscribe to the plan", "error")
            }
        })
    } else {
        if (context == "change"){
            //TODO
            fetch(`/payment/${uid}/plan/change/${planId}`, {
                method: 'POST'
            }).then((data) => {
                return data.json()
            }).then((response) => {
                if (response.error) {
                    createMessage(response.error, "error")
                } else if (response.url){
                    window.location = response.url
                }
            })
        } else {
            fetch(`/payment/${uid}/plan/${planId}`, {
                method: 'POST'
            }).then((data) => {
                return data.json()
            }).then((response) => {
                if (response.error) {
                    createMessage(response.error, "error")
                } else if (response.url){
                    window.location = response.url
                }
            })
        }
    }
}