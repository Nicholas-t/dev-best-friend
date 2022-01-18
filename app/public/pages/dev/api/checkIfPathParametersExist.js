function checkIfPathParametersExist(){
    document.querySelector('input[id="endpoint"]').value.match(/{(.*)}/g).forEach((parameter) => {
        if (!document.querySelector(`input[id ^= "default-path-parameter-key"][value="${parameter.slice(1, parameter.length - 1)}"]`)){
            if (confirm(`Seems like you added a path parameter in the URL (${parameter.slice(1, parameter.length - 1)}), would you like to add it as a path parameter ?`)){
                addNewDefaultPathParameter({
                    name : parameter.slice(1, parameter.length - 1),
                    label : parameter.slice(1, parameter.length - 1)
                })
                createMessage(`Field Added, don't forget to submit.`,'success')
            }
        }
    })
}

setTimeout(checkIfPathParametersExist, 1000)