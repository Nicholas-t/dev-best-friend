function randomColor(){
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return "#" + randomColor;
}
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
function fillProjectList(){
    fetch(`/db/dev/get/api`).then((data) => {
        return data.json()
    }).then((response) => {
        if (response.result.length == 0){
            document.getElementById("project-list-carousel").innerHTML += `
            <div class="row">
                <a href="/dev/api/create" style="border-radius:100px;" type="button" class="move-up-on-hover btn btn-primary btn-lg btn-block">
                    <i class="ti-bar-chart"></i>                      
                    Step 1. Create your first API!
                </a>
            </div>
            <br><br>
            <div class="row">
                <div class="progress col-10">
                    <div class="progress-bar bg-primary" role="progressbar" style="width: 33%" aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <div class="col-2">
                    <p class="text-muted"> 33 % (Registered !)</p>
                </div>
            </div>
            `
        } else {
            fetch(`/db/dev/get/users`).then((data) => {
                return data.json()
            }).then((response) => {
                let curTimeStamp = Number(new Date()) / 1000
                let labels = []
                let data = []
                for (let i = 0 ; i < 30 ; i ++){
                    let time = new Date((curTimeStamp - (i*60*60*24)) * 1000)
                    labels.push(`${time.getDate()}/${time.getMonth() + 1}`)
                    data.push(0)
                }
                for (let i = 0 ; i < response.result.length; i++) {
                    let time = new Date(response.result[i].client_time_created * 1000)
                    if (labels.includes(`${time.getDate()}/${time.getMonth() + 1}`)) {
                        data[labels.indexOf(`${time.getDate()}/${time.getMonth() + 1}`)] += 1
                    }
                }
                var areaData = {
                    labels: labels.reverse(),
                    datasets: [{
                    label: '#New Users',
                    data: data.reverse(),
                    backgroundColor: [
                        'rgba(245, 247, 255, 0.7)',
                    ],
                    borderColor: 'black',
                    borderWidth: 2,
                    fill: true, // 3: no fill
                    }]
                };
                
                var areaChartCanvas = $("#new_user_chart").get(0).getContext("2d");
                new Chart(areaChartCanvas, {
                    type: 'line',
                    data: areaData,
                    options: areaOptions
                });
            })
            fetch(`/db/dev/get/chat`).then((data) => {
                return data.json()
            }).then((response) => {
                let chat = response.result.reverse()
                let chatHtml = ``
                let userChats = {}
                for (let i = 0 ; i < chat.length ; i ++){
                    if (!userChats[chat[i].client_id]){
                        userChats[chat[i].client_id] = {
                            client_name : chat[i].client_name,
                            client_id : chat[i].client_id,
                            content : chat[i].content,
                            time : new Date(chat[i].time_created*1000),
                            n : 1
                        }
                    } else {
                        userChats[chat[i].client_id].n += 1
                    }
                }
                let userIds = Object.keys(userChats)
                for (let i = 0 ; i < Math.min(5, userIds.length) ; i ++){
                    let chat = userChats[userIds[i]]
                    chatHtml += `
                    <li class="move-up-on-hover row" style="cursor:pointer;" onclick="(() => {window.location='/dev/users/view/${chat.client_id}'})()">
                        <div class="col-4">
                            <img  src="https://eu.ui-avatars.com/api/?name=${
                                chat.client_name
                            }" alt="user"> 
                        </div>
                        <div class="col-8">
                            <p class="text-info mb-1">
                            ${
                                chat.client_name
                            } <small> (${chat.n}) </small>
                            </p>
                            <p class="mb-0">
                            ${
                                chat.content.split("\n").join("</br>")
                            }
                            <br>
                            <small>
                            ${chat.time.getDate()} ${MONTHS[chat.time.getMonth()]} ${
                                formatDigit(chat.time.getHours())
                            }:${
                                formatDigit(chat.time.getMinutes())
                            }
                            </small>
                            </p>
                        </div>
                    </li>`
                }
                if (chatHtml !== ''){
                    document.getElementById("unread-message").innerHTML = chatHtml
                }
                if (userIds.length > 5) {
                    document.getElementById("more_message").innerHTML = `(${userIds.length - 5} More)`
                }
            })
            
            fetch(`/db/dev/get/log?n=10000`).then((data) => {
                return data.json()
            }).then((response) => {
                let curTimeStamp = Number(new Date()) / 1000
                let data = {}
                let labels = []
                for (let i = 0 ; i < 30 ; i ++){
                    let time = new Date((curTimeStamp - (i*60*60*24)) * 1000)
                    labels.push(`${time.getDate()}/${time.getMonth() + 1}`)
                }
                for (let i = 0 ; i < response.result.length; i++) {
                    let time = new Date(response.result[i].timestamp * 1000)
                    if (!data[response.result[i].api_name]) {
                        data[response.result[i].api_name] = [
                            0,0,0,0,0,
                            0,0,0,0,0,
                            0,0,0,0,0,
                            0,0,0,0,0,
                            0,0,0,0,0,
                            0,0,0,0,0]
                    }
                    data[response.result[i].api_name][labels.indexOf(`${time.getDate()}/${time.getMonth() + 1}`)] += 1
                }
                let datasets = []
                for (let i = 0 ; i < Object.keys(data).length ; i++){
                    datasets.push({
                        label: Object.keys(data)[i],
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
                
                var areaChartCanvas = $("#api_log_chart").get(0).getContext("2d");
                new Chart(areaChartCanvas, {
                    type: 'line',
                    data: areaData,
                    options: areaOptions
                });
            })
            fetch(`/db/dev/get/project`).then((data) => {
                return data.json()
            }).then((response) => {
                const projects = response.result
                if (projects.length == 0){
                    document.getElementById("project-list-carousel").innerHTML += `
                    <div class="row">
                        <a href="/dev/project/create" style="border-radius:100px;" type="button" class="move-up-on-hover btn btn-primary btn-lg btn-block">
                            <i class="ti-rocket"></i>                      
                            Step 2. Create your first project!
                        </a>
                    </div>
                    <br><br>
                    <div class="row">
                        <div class="progress col-10">
                            <div class="progress-bar bg-primary" role="progressbar" style="width: 66%" aria-valuenow="66" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="col-2">
                            <p class="text-muted"> 66 % (API Created !)</p>
                        </div>
                    </div>
                    `
                }
                if (projects.length > 1){
                    document.getElementById("carousel-nav").innerHTML = `
                    <a class="carousel-control-prev" href="#detailedReports" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#detailedReports" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                    </a>`
                }
                for (let i = 0 ; i < projects.length ; i++){
                    const project = projects[i]
                    let d = `
                    <div class="carousel-item ${i == 0 ? "active" : ""}">
                        <div class="row">
                            <div class="col-md-12 col-xl-12 d-flex flex-column justify-content-start">
                                <div class="ml-xl-4 mt-3">
                                    <p>Path : <strong>/p/${project.uid}</strong> &nbsp;&nbsp;&nbsp;
                                    <small class="move-up-on-hover">
                                    <a class="btn-sm btn-info" href="/p/${project.uid}/admin"><i class="mdi mdi-account-key"></i> Admin View</a>
                                    </small>
                                    </p>
                                    <h1 class="text-primary">${project.name}</h1>
                                    <h3 class="font-weight-500 mb-xl-4 text-primary" id="n-user-${project.uid}"></h3>
                                    <p class="mb-2 mb-xl-0">${project.description}</p>
                                </div>  
                            </div>
                            <div class="col-md-12 col-xl-12  ml-xl-4 mt-3">
                                <p class="card-title">Top Users</p>
                                <div class="row">
                                    <div class="table-responsive mb-6 mb-md-0 mt-6">
                                        <table id="user-${project.uid}" class="table table-borderless report-table">
                                            <tr>
                                                <th class="pl-0  pb-2 border-bottom">User</th>
                                                <th class="border-bottom pb-2">
                                                    <h5 class="font-weight-bold mb-0">Email<h5>
                                                </th>
                                                <th class="pl-0  pb-2 border-bottom"># Calls</th>
                                                <th class="pl-0  pb-2 border-bottom">View</th>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                    document.getElementById("project-list-carousel").innerHTML += d
                    fetch(`/db/dev/get/users-summary/${project.uid}`).then((data) => {
                        return data.json()
                    }).then((response) => {
                        const users = response.result
                        document.getElementById(`n-user-${project.uid}`).innerHTML = `${response.count} <small>Users</small>`
                        let html = ''
                        if (users.length != 0){
                            for (let i = 0 ; i < Math.min(users.length, 5) ; i++){
                                if (users[i].client_name){
                                    html += `
                                    <tr>
                                        <td class="text-muted">${users[i].client_name}</td>
                                        <td class="px-0">
                                            ${users[i].client_email}
                                        </td>
                                        <td><h5 class="font-weight-bold mb-0" id="${users[i].client_id}-log-n">${users[i].count}</h5></td>
                                        <td><a class="move-up-on-hover btn-sm btn-info" alt="View User" href="/dev/users/view/${users[i].client_id}">View</a></td>
                                    </tr>`
                                }
                            }
                        } 
                        if ( html == '' ) {
                            html += `
                                <tr>
                                    <td class="text-muted"></td>
                                    <td class="w-100 px-0">
                                        <p class="text-danger"> No Users </p>
                                    </td>
                                    <td></td>
                                    <td></td>
                                </tr>`
                        }
                        
                        document.getElementById(`user-${project.uid}`).innerHTML += html
                    })
                }
            })
        }
    })
}

fillProjectList()
