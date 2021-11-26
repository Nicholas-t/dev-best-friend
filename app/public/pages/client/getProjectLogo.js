function getProjectLogo(projectUid){
    fetch(`/check-is-logo-exist/${projectUid}`).then((data) => {
        return data.json()
    }).then((data) => {
        if (data.exist) {
            document.querySelectorAll(".project_logo").forEach((element) => {
                element.src = `/project-logo/${projectUid}.png`
            })
        } else {
            document.querySelectorAll(".project_logo").forEach((element) => {
                element.src = `/static/images/logo-white.png`
            })
        }
    })
}