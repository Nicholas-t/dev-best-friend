
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

function toPath(name){
    return encodeURIComponent(name.split(" ").join("-").toLowerCase())
}


function refreshPath(){
    let currentPath = toPath(document.getElementById("name").value)
    fetch(`/db/dev/check/is-page-path-available?path=${currentPath}&project_uid=${uid}`).then((data) => {
        return data.json()
    }).then((response) => {
        if (response.available){
            document.getElementById("path").value = currentPath;
        } else {
            document.getElementById("path").value = `${currentPath}-${makeID(15)}`;
        }
    })
}
