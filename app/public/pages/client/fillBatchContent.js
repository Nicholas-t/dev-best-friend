const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

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
                    createMessage("Please wait while we are processing your file. Do not leave the page.", "info")
                    document.getElementById("loader-container").style.display = ''
                    fetch(`/db/dev/process/batch/${processId}/${uid}`, {
                        method: 'POST',
                    }).then((data) => {
                        return data.json()
                    }).then((data) => {
                        if (data.success){
                            createMessage("The file is fully processed. You can now download the resulting file.", "success")
                            fetch(`/db/dev/modify/batch/${processId}/status/2`, {
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
                            <label class="badge badge-${batchStatus[2].button_type}">
                                ${batchStatus[2].label}
                            </label>
                            `
                            document.getElementById("loader-container").style.display = 'none'
                        } else {
                            createMessage("Something wrong while processing your file. You can download the last checkpoint.", "error")
                            fetch(`/db/dev/modify/batch/${processId}/status/3`, {
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
                            <label class="badge badge-${batchStatus[3].button_type}">
                                ${batchStatus[3].label}
                            </label>
                            `
                            document.getElementById("loader-container").style.display = 'none'
                        }
                        document.getElementById("process_content_button").disabled = true
                        document.getElementById("download_content_button").disabled = false
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