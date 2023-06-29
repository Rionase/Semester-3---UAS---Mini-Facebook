
document.getElementById("edit-profile-button").onclick = () => {

    let Name = document.getElementById("name").value ;
    let City = document.getElementById("city").value ;
    let Phone = document.getElementById("phone").value ;

    let Gender = ""
    let Relationship = ""
    let Privacy = ""

    if ( Name == "" ) {
        Name = null
    }
    if ( City == "" ) {
        City = null
    }
    if ( Phone == "" ) {
        Phone = null
    }
    

    if ( document.getElementById("radio_1").checked ) {
        Gender = "Male"
    }
    else if ( document.getElementById("radio_2").checked ) {
        Gender = "Female"
    }
    else {
        Gender = null
    }

    if ( document.getElementById("radio_3").checked ) {
        Relationship = "Single"
    }
    else if ( document.getElementById("radio_4").checked ) {
        Relationship = "In Relationship"
    }
    else {
        Relationship = null
    }

    if ( document.getElementById("radio_5").checked ) {
        Privacy = "Public"
    }
    else if ( document.getElementById("radio_6").checked ) {
        Privacy = "Private"
    }
    else {
        Privacy = null
    }

    EditUserProfile( Name, City, Phone, Gender, Relationship, Privacy )

}

function EditUserProfile ( Name, City, Phone, Gender, Relationship, Privacy ) {
    axios.put( "/profile/userprofile", {
        name : Name,
        city: City,
        phone: Phone,
        gender: Gender,
        relationship: Relationship,
        privacy: Privacy
    })
    .then( (results) => {
        window.location.href = `/profile/userprofile/${ document.getElementById("username-hidden").value }`
    })
    .catch( (err) => {
        console.log(err)
    })
}

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