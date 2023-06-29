
document.getElementById("post-story").onclick = () => {

    let formData = new FormData();
    formData.append( 'image', document.getElementById("input_gambar").files[0] );
    formData.append( "description", document.getElementById("input_description").value )
    axios.post("/posts/api/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data'}
    })
    .then(response => {
        alert("Posting berhasil :)")
        window.location.reload()
    })

}