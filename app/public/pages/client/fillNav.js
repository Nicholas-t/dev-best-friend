

function fillNav(projectUid){
    let sideBar = ``
    if (admin){
        sideBar += `
            <li class="nav-item">
                <a class="nav-link">
                    <span class="menu-title"><u>Admin Area</u></span> <br>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/p/${projectUid}/admin">
                    <i class="icon-layout menu-icon"></i>
                    <span class="menu-title">Project Pages <br><small>(Create, Modify, Delete)</small></span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/p/${projectUid}/crm">
                    <i class="icon-head menu-icon"></i>
                    <span class="menu-title">CRM<br><small>(Users, Custom fields)</small></span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/p/${projectUid}/manage">
                    <i class="icon-columns menu-icon"></i>
                    <span class="menu-title">Manage Project<br><small>(Plans, Project)</small></span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/dev/">
                    <i class="icon-arrow-left menu-icon"></i>
                    <span class="menu-title">Return to Dashboard</span>
                </a>
                <hr>
            </li>`
    } else {
        sideBar += `
        <li class="nav-item">
            <a class="nav-link">
                <span class="menu-title"><u>User Area</u></span>
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/p/${projectUid}/home">
                <i class="icon-head menu-icon"></i>
                <span class="menu-title">My Space</span>
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/p/${projectUid}/settings">
                <i class="icon-cog menu-icon"></i>
                <span class="menu-title">Account Setings</span>
            </a>
            <hr>
        </li>
        `
    }
    document.getElementById("sidebar").innerHTML = sideBar
    fetch(`/db/dev/get/${projectUid}/page`).then((data) => {
        return data.json()
    }).then((data) => {
        const pages = data.result
        let projectPageHtml = ``
        for (let i = 0 ; i < pages.length ; i++){
            if (pages[i].type == "external_url"){
                projectPageHtml += `
                <li class="nav-item">
                    <a class="nav-link" target="_blank" href="${pages[i].external_url}">
                        <i class="icon-link menu-icon"></i>
                        <span class="menu-title">${pages[i].name}</span>
                    </a>
                </li>
                `
            } else {
                projectPageHtml += `
                <li class="nav-item">
                    <a class="nav-link" href="/p/${projectUid}/${pages[i].path}">
                        <i class="${pages[i].icon} menu-icon"></i>
                        <span class="menu-title">${pages[i].name}</span>
                    </a>
                </li>
                `
            } 
        }
        document.getElementById("sidebar").innerHTML += `
        ${projectPageHtml}
        `
        if (!admin){
            document.getElementById("sidebar").innerHTML += `
        <li class="nav-item">
            <a class="nav-link" href="/account/logout">
                <i class="icon-arrow-left menu-icon"></i>
                <span class="menu-title">Log Out</span>
            </a>
        </li>
        `
        }
    })
}
