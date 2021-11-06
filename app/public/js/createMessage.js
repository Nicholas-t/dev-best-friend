function createMessage(message, type){
    if (type == "error"){
        toastr.error(message)
    }
    if (type == "info"){
        toastr.info(message)
    }
    if (type == "success"){
        toastr.success(message)
    }
    if (type == "warning"){
        toastr.warning(message)
    }
}