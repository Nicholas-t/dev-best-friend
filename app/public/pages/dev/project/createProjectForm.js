String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function makeID(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

function titleCase(iconId){
    return iconId.split("-").join(" ").toProperCase()
}
function toUid(name){
    return encodeURIComponent(name.split(" ").join("-").toLowerCase())
}

function fillIconList(){
    fetch("/constant/iconList").then((data) => {
        return data.json()
    }).then((response) => {
        let iconList = response.icon_list
        for (let i = 0 ; i < iconList.length ; i++){
            document.getElementById("icon").innerHTML += `
            <option value="${iconList[i]}">${titleCase(iconList[i])}</option>
            `
        }
    })
}

function changeIconPreview(){
    let icon = document.getElementById("icon").value
    document.getElementById("icon-preview").innerHTML = `<i class="mdi mdi-${icon}"></i>`
}


function refreshUid(){
    let currentUID = toUid(document.getElementById("name").value)
    fetch(`/db/dev/check/is-project-uid-available?uid=${currentUID}`).then((data) => {
        return data.json()
    }).then((response) => {
        if (response.available){
            document.getElementById("uid").value = currentUID;
        } else {
            document.getElementById("uid").value = `${currentUID}-${makeID(15)}`;
        }
    })
}


fillIconList()