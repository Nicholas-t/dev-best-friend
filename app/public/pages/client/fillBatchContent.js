const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function setLiveProgressTracker(processId){
    var intervalId = null;
    var refreshProgress = function(){
        fetch(`/db/dev/get/batch/${processId}/result`).then((data) => {
            return data.json()
        }).then((data) => {
            const resultData = data.result
            document.getElementById("progress").innerHTML = `
            <div class="progress progress-md flex-grow-1 mr-4">
              <div class="progress-bar bg-inf0" role="progressbar" style="width: ${Number(resultData.length / uploadedData.length * 100)}%" aria-valuenow="${Number(resultData.length / uploadedData.length * 100)}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <p class="mb-0">${resultData.length} / ${uploadedData.length}</p>`
            if (resultData.length === uploadedData.length){
                clearInterval(intervalId);
            }
        })
    };
    intervalId = setInterval(refreshProgress, 300);
}

let uploadedData = []
let resultedData = []
let batchDetail = {}
let processDetail = {}
let batchStatus = {}
function fillBatchContent() {
    fetch(`/db/dev/get/batch/${processId}/config`).then((data) => {
        return data.json()
    }).then((data) => {
        batchDetail = data.result
    })
    fetch(`/constant/batchStatus`).then((data) => {
        return data.json()
    }).then((data) => {
        batchStatus = data
        fetch(`/db/dev/get/batch/${processId}`).then((data) => {
            return data.json()
        }).then((data) => {
            processDetail = data.result[0]
            document.getElementById("batch_status").innerHTML = `
            <label class="badge badge-${batchStatus[processDetail.status].button_type}">
            ${batchStatus[processDetail.status].label}
            </label>
            `
            if (processDetail.status != 0){
                document.getElementById("process_content_button").disabled = true
                document.getElementById("download_content_button").disabled = false
            }
            fetch(`/db/dev/get/batch/${processId}/content`).then((data) => {
                return data.json()
            }).then((data) => {
                const headers = Object.keys(data.result[0])
                uploadedData = data.result
                const allRows = []
                for (let i = 0 ; i < data.result.length ; i++){
                    const row = data.result[i]
                    let rowValues = []
                    for (let j = 0 ; j < headers.length ; j ++){
                        rowValues.push(row[headers[j]])
                    }
                    allRows.push(`<tr>
                        <td>${rowValues.join("</td><td>")}</td>
                    </tr>`)
                }
                document.getElementById("uploaded_content_header").innerHTML = `<tr>
                    <th>${headers.join("</th><th>")}</th>
                </tr>`
                document.getElementById("uploaded_content_rows").innerHTML = allRows.join("")
                fetch(`/db/dev/get/batch/${processId}/result`).then((data) => {
                    return data.json()
                }).then((data) => {
                    const resultData = data.result
                    document.getElementById("progress").innerHTML = `
                    <div class="progress progress-md flex-grow-1 mr-4">
                      <div class="progress-bar bg-inf0" role="progressbar" style="width: ${Number(resultData.length / uploadedData.length * 100)}%" aria-valuenow="${Number(resultData.length / uploadedData.length * 100)}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p class="mb-0">${resultData.length} / ${uploadedData.length}</p>`
                })
                if (processDetail.status == 1){
                    setLiveProgressTracker(processId)
                }
            })
        })
    })
}


function processContent(){
    // TO CHECK SUFFICIENT CREDIT
    fetch(`/db/dev/check-available-credit/${batchDetail.api_id}/${userId}`).then((data) => {
        return data.json()
    }).then((response) => {
        if (response.error && !admin){
            createMessage(response.error, "error")
        } else {
            if ((response.credit_available <= 0 && !admin)
             || (response.credit_available < uploadedData.length && !admin)){
                createMessage(`You dont have sufficient credit. You need ${uploadedData.length} to process this file. (You have ${response.credit_available})`, "error")
            } else {
                if(confirm(`Are you sure you would like to process this batch ? (This will consume ${uploadedData.length} credit)`)){
                    document.querySelectorAll(".process_status").forEach(element => {
                        element.innerHTML = `<label class="badge badge-warning">Pending</label>`
                    });
                    fetch(`/db/dev/modify/batch/${processId}/status/1`, {
                        method: 'POST',
                        mode: 'cors',
                        cache: 'no-cache', 
                        credentials: 'same-origin',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        redirect: 'follow',
                        referrerPolicy: 'no-referrer'
                    })
                    document.getElementById("batch_status").innerHTML = `
                    <label class="badge badge-${batchStatus[1].button_type}">
                        ${batchStatus[1].label}
                    </label>
                    `
                    fetch(`/db/dev/process/batch/${processId}/${uid}`, {
                        method: 'POST',
                    }).then((data) => {
                        return data.json()
                    }).then((data) => {
                        if (data.success){
                            createMessage("The file is currently being processed.", "info")
                            setLiveProgressTracker(processId)
                        } else {
                            createMessage("Something wrong while processing your file. You can download the last checkpoint.", "error")
                        }
                    })
                } else {
                    createMessage("Processing is cancelled. We are not processing your batch.", "info")
                }
            }
        }
    })
}

function downloadContent(){
    window.open(`/db/dev/get/batch/${processId}/download`, '_blank').focus();
}