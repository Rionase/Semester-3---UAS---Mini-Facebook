
document.getElementById("edit-post").onclick = () => {

    let formData = new FormData();
    formData.append( 'image', document.getElementById("input_gambar").files[0] );
    formData.append( "description", document.getElementById("input_description").value )
    axios.put(`/posts/api/${document.getElementById("posts-id").value}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data'}
    })
    .then(response => {
        alert("Posting berhasil diedit :)")
        window.location.reload()
    })

}