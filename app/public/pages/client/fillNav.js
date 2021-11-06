

function fillNav(projectUid){
    let sideBar = ``
    if (admin){
        sideBar += `
            <li class="nav-item">
                <a class="nav-link">
                    <span class="menu-title"><u>Admin Area</u></span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/p/${projectUid}/admin">
                    <i class="icon-cog menu-icon"></i>
                    <span class="menu-title">Manage Pages <br><small>(Create, Modify, Delete)</small></span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/p/${projectUid}/manage">
                    <i class="icon-cog menu-icon"></i>
                    <span class="menu-title">Manage Project<br><small>(Users, Plans, Project)</small></span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/dev/">
                    <i class="icon-cog menu-icon"></i>
                    <span class="menu-title">Return to Dashboard</small></span>
                </a>
                <hr>
            </li>`
    }
    document.getElementById("sidebar").innerHTML = sideBar
    fetch(`/db/dev/get/${projectUid}/page`).then((data) => {
        return data.json()
    }).then((data) => {
        const pages = data.result
        for (let i = 0 ; i < pages.length ; i++){
            if (pages[i].type == "external_url"){
                document.getElementById("sidebar").innerHTML += `
                <li class="nav-item">
                    <a class="nav-link" target="_blank" href="${pages[i].external_url}">
                        <i class="icon-link menu-icon"></i>
                        <span class="menu-title">${pages[i].name}</span>
                    </a>
                </li>
                `
            } else {
                document.getElementById("sidebar").innerHTML += `
                <li class="nav-item">
                    <a class="nav-link" href="/p/${projectUid}/${pages[i].path}">
                        <i class="${pages[i].icon} menu-icon"></i>
                        <span class="menu-title">${pages[i].name}</span>
                    </a>
                </li>
                `
            } 
        }
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
