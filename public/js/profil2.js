document.getElementById("input_gambar").onchange = () => {
    let formData = new FormData();
    formData.append( 'image', document.getElementById("input_gambar").files[0] );
    console.log( formData )
    axios.post("/profile/editprofile", formData, {
        headers: { 'Content-Type': 'multipart/form-data'}
    })
    .then(response => {
        window.location.reload()
    })
}