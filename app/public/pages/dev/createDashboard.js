
function randomColor(){
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return "#" + randomColor;
}

function fillProjectList(){
    fetch(`/db/dev/get/project`).then((data) => {
        return data.json()
    }).then((response) => {
        const projects = response.result
        if (projects.length == 0){
            document.getElementById("project-list-carousel").innerHTML += `
            <div class="row">
                <a href="/dev/project/create" style="border-radius:100px;" type="button" class="btn btn-primary btn-lg btn-block">
                    <i class="ti-rocket"></i>                      
                    Create your first project!
                </a>
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
                    <div class="col-md-12 col-xl-3 d-flex flex-column justify-content-start">
                        <div class="ml-xl-4 mt-3">
                            <p>Path : <strong>/p/${project.uid}</strong><br><small>(<a href="/p/${project.uid}/admin">Admin View</a>)</small></p>
                            <h1 class="text-primary">${project.name}</h1>
                            <h3 class="font-weight-500 mb-xl-4 text-primary" id="n-user-${project.uid}"></h3>
                            <p class="mb-2 mb-xl-0">${project.description}</p>
                        </div>  
                    </div>
                    <div class="col-md-12 col-xl-9">
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

fillProjectList()
