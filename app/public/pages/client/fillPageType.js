
function fillPageType(){
    fetch("/constant/pageTypes").then((data) => {
        return data.json()
    }).then((response) => {
        let pageTypes = Object.keys(response)
        for (let i = 0 ; i < pageTypes.length ; i++){
            document.getElementById("type").innerHTML += `
            <option value="${pageTypes[i]}">${response[pageTypes[i]].label} - <small>${response[pageTypes[i]].description}</small></option>
            `
        }
    })
}

fillPageType()