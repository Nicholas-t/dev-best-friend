
function fillIconPage(icon){
    fetch("/constant/iconPage").then((data) => {
        return data.json()
    }).then((response) => {
        const icons = response.icon_page
        let options = ``
        for (let i = 0; i < icons.length; i++){
            options += `<option ${icons[i] === icon ? "selected" : ""} value="${icons[i]}">${icons[i]}</option>`
        }
        document.getElementById("icon-list").innerHTML = options
        changeIconPreview()
    })
}

function changeIconPreview(){
    document.getElementById("icon-preview").innerHTML = `
    <i class="${document.getElementById("icon-list").value} menu-icon"></i>
    `
}
