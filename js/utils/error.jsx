function HandleError(response) {
    if (!response.ok) {
        return Promise.reject(response)
    }
    return response;
}


export { HandleError}