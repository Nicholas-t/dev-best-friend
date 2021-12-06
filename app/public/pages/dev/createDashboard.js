function randomColor(){
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return "#" + randomColor;
}

var areaOptions = {
    plugins: {
        filler: {
            propagate: true
        }
    },
    legend: {
        display: false
    }
}
function fillProjectList(){
    fetch(`/db/dev/get/api`).then((data) => {
        return data.json()
    }).then((response) => {
        if (response.result.length == 0){
            document.getElementById("project-list-carousel").innerHTML += `
            <div class="row">
                <a href="/dev/api/create" style="border-radius:100px;" type="button" class="btn btn-primary btn-lg btn-block">
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
                for (let i = 0 ; i < 7 ; i ++){
                    let time = new Date((curTimeStamp - (i*60*60*24)) * 1000)
                    labels.push(`${time.getDate()}/${time.getMonth()}`)
                    data.push(0)
                }
                for (let i = 0 ; i < response.result.length; i++) {
                    let time = new Date(response.result[i].client_time_created * 1000)
                    if (labels.includes(`${time.getDate()}/${time.getMonth()}`)) {
                        data[labels.indexOf(`${time.getDate()}/${time.getMonth()}`)] += 1
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
            
            fetch(`/db/dev/get/log?n=10000`).then((data) => {
                return data.json()
            }).then((response) => {
                let curTimeStamp = Number(new Date()) / 1000
                let data = {}
                let labels = []
                for (let i = 0 ; i < 7 ; i ++){
                    let time = new Date((curTimeStamp - (i*60*60*24)) * 1000)
                    labels.push(`${time.getDate()}/${time.getMonth()}`)
                }
                for (let i = 0 ; i < response.result.length; i++) {
                    let time = new Date(response.result[i].timestamp * 1000)
                    if (!data[response.result[i].api_name]) {
                        data[response.result[i].api_name] = [0,0,0,0,0,0,0]
                    }
                    data[response.result[i].api_name][labels.indexOf(`${time.getDate()}/${time.getMonth()}`)] += 1
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
                        <a href="/dev/project/create" style="border-radius:100px;" type="button" class="btn btn-primary btn-lg btn-block">
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
                            <div class="col-md-12 col-xl-6 d-flex flex-column justify-content-start">
                                <div class="ml-xl-4 mt-3">
                                    <p>Path : <strong>/p/${project.uid}</strong><br><small>(<a href="/p/${project.uid}/admin">Admin View</a>)</small></p>
                                    <h1 class="text-primary">${project.name}</h1>
                                    <h3 class="font-weight-500 mb-xl-4 text-primary" id="n-user-${project.uid}"></h3>
                                    <p class="mb-2 mb-xl-0">${project.description}</p>
                                </div>  
                            </div>
                            <div class="col-md-12 col-xl-6">
                            <p class="card-title">User Summary</p>
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
                            for (let i = 0 ; i < users.length ; i++){
                                if (users[i].client_name){
                                    html += `
                                    <tr>
                                        <td class="text-muted">${users[i].client_name}</td>
                                        <td class="px-0">
                                            ${users[i].client_email}
                                        </td>
                                        <td><h5 class="font-weight-bold mb-0" id="${users[i].client_id}-log-n">${users[i].count}</h5></td>
                                        <td><a href="/p/${project.uid}/manage/users/${users[i].client_id}">View</a></td>
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
