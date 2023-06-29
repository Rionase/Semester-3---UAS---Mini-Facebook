
document.getElementById("sign-up-button").onclick = () => {

    let Validity = []

    let username = document.getElementById("username-input").value ;
    let password = document.getElementById("password-input").value ;
    let email = document.getElementById("email-input").value ;
    let birthday = document.getElementById("birthday-input").value ;


    
    if ( username == "" ) {
        document.getElementById("username-error").style.display = "";
        document.getElementById("username-error").innerHTML = "Username cannot be empty."
    } 
    else {
        document.getElementById("username-error").style.display = "none";
        document.getElementById("username-error").innerHTML = ""
        Validity.push( true )
    }



    if ( password == "" ) {
        document.getElementById("password-error").style.display = "";
        document.getElementById("password-error").innerHTML = "Password cannot be empty."
    } 
    else {
        document.getElementById("password-error").style.display = "none";
        document.getElementById("password-error").innerHTML = ""
        Validity.push( true )
    }


    if ( email == "" ) {
        document.getElementById("email-error").style.display = "";
        document.getElementById("email-error").innerHTML = "Email cannot be empty."
    } 
    else {
        document.getElementById("email-error").style.display = "none";
        document.getElementById("email-error").innerHTML = ""
        Validity.push( true )
    }



    if ( birthday == "" ) {
        document.getElementById("birthday-error").style.display = "";
        document.getElementById("birthday-error").innerHTML = "Birthday cannot be empty."
    } 
    else {
        document.getElementById("birthday-error").style.display = "none";
        document.getElementById("birthday-error").innerHTML = ""
        Validity.push( true )
    }

    if ( Validity.length == 4 ) {
        SignUp()
    }

}

function SignUp () {
    let username = document.getElementById("username-input").value ;
    axios.get(`/user/username/${username}`)
    .then( (results) => {
        console.log(results)
        if ( results.data.username == "Registered" ) {
            document.getElementById("username-error").style.display = "";
            document.getElementById("username-error").innerHTML = "Username has been registered by other users."
        }

        else if ( results.data.username == "Not Registered" ) {
            axios.post("/user/signup", {
                username: document.getElementById("username-input").value ,
                password: document.getElementById("password-input").value ,
                email: document.getElementById("email-input").value ,
                birthday: document.getElementById("birthday-input").value
            })
            .then( (results) => {
                window.location.href = "/posts"
            })
            .catch ( (results) => {
                console.log("gagal")
            })
        }

    })
    .catch( (err) => {
        console.log("Gagal")
    })
}
