document.getElementById("log-in-button").onclick = () => {

    let Validity = []

    let username = document.getElementById("username-input").value ;
    let password = document.getElementById("password-input").value ;


    
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



    if ( Validity.length == 2 ) {
        LogIn()
    }

}

function LogIn() {

    axios.post("/user/login", {
        username: document.getElementById("username-input").value,
        password: document.getElementById("password-input").value
    })
    .then( (results) => {
        if ( results.data.status == "Passed" ) {
            
            window.location.href = "/posts"
            
        }
        else if ( results.data.status == "Not Passed" ) {

            document.getElementById("username-error").style.display = "";
            document.getElementById("username-error").innerHTML = "Username or Password is not valid.";
            document.getElementById("password-error").style.display = "none";
            document.getElementById("password-error").innerHTML = "";

        }
    })

}