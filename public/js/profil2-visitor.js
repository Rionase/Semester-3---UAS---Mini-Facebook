function LoadStatus () {
    axios.get( `/friends/api/checkStatus/${ document.getElementById("username-hidden").value }` )
    .then( (results) => {

        if ( results.data == null ) {
            document.getElementById( "edit" ).innerHTML = `
            <a id="box-add-friend" onclick="AddFriend('${document.getElementById("username-hidden").value}')">
                <img src="/image/add-friend.png" alt="">
                <label id="add-friend">Add Friend</label>
            </a>`
            
        }
        else if ( results.data.status == 1 ) {
            document.getElementById( "edit" ).innerHTML = `
            <a id="box-friend">
                <img src="/image/friend-checked.png" alt="">
                <label id="friend">Friend</label>
            </a>
            <a id="box-delete-friend" onclick="Unfriend('${document.getElementById("username-hidden").value}')">
                <img src="/image/delete-friend.png" alt="">
                <label id="delete-friend">Unfriend</label>
            </a>`
        }
        else if ( results.data.status == 0 && results.data.user2 == document.getElementById("username-hidden").value ) {
            document.getElementById( "edit" ).innerHTML = `
            <a id="box-delete-friend" onclick="CancelRequest('${document.getElementById("username-hidden").value}')">
                <img src="/image/delete-friend.png" alt="">
                <label id="delete-friend">Cancel Request</label>
            </a>`
        }
        else if ( results.data.status == 0 && results.data.user1 == document.getElementById("username-hidden").value ) {
            document.getElementById( "edit" ).innerHTML = `
            <a id="box-add-friend"  onclick="ConfirmRequest('${document.getElementById("username-hidden").value}')">
                <img src="/image/add-friend.png" alt="">
                <label id="add-friend">Accept</label>
            </a>
            <a id="box-delete-friend" onclick="DeclineRequest('${document.getElementById("username-hidden").value}')">
                <img src="/image/delete-friend.png" alt="">
                <label id="delete-friend">Decline</label>
            </a>
            `
        }
    })
}

function AddFriend ( username ) {
    axios.post( `/friends/api/AddFriend/${username}` )
    .then( (results) => {
        window.location.reload()
    })
}

function ConfirmRequest ( username ) {
    axios.put ( `/friends/api/AcceptRequest/${username}` )
    .then( (results) => {
        window.location.reload()
    })
}

function DeclineRequest ( username ) {
    axios.delete( `/friends/api/DeclineRequest/${username}` )
    .then( (results) => {
        window.location.reload()
    })
}

function CancelRequest ( username ) {
    axios.delete( `/friends/api/CancelRequest/${username}` )
    .then( (results) => {
        window.location.reload()
    })
}

function Unfriend ( username ) {
    axios.delete( `/friends/api/Unfriend/${username}` )
    .then( (results) => {
        window.location.reload()
    })
}






function LoadProfile() {
    axios.get( `/profile/userprofileData/${ document.getElementById("username-hidden").value }` )
    .then((results) => {
        console.log(results.data)
        if ( results.data.msg == "public" || results.data.msg == "private-friend" ) {
            let data = results.data.data

            let name = ""
            let age = ""
            let birthday = ""
            let city = ""
            let gender = ""
            let relationship = ""
            let privacyLogo = ""
            let privacy = data.privacy
            let phone = ""
            let email = ""

            if ( data.name == null ) { name = "-" }
            else { name = data.name }

            if ( data.age == null ) { age = "-" }
            else { age = data.age }

            if ( data.birthday == null ) { birthday = "-" }
            else { birthday = data.birthday }
            
            if ( data.city == null ) { city = "-" }
            else { city = data.city }

            if ( data.gender == null ) { gender = "-" }
            else { gender = data.gender }

            if ( data.relationship == null ) { relationship = "-" }
            else { relationship = data.relationship }

            if ( data.privacy == "Public" ) { privacyLogo = `<img src="/image/public.png" alt="" class="logo">` }
            else if ( data.privacy == "Private" ) { privacyLogo = `<img src="/image/private.png" alt="" class="logo">` }

            if ( data.phone == null ) { phone = "-" }
            else { phone = data.phone }

            if ( data.email == null ) { email = "-" }
            else { email = data.email }

            document.getElementById("profile-description").innerHTML = `
                <div class="title">Basic Info</div>

                <div class="main-2">
                    <div class="main-3">
                        <img src="/image/name.png" alt="" class="logo">
                    </div>
                    <div>
                        <div>${name}</div>
                        <div class="description">Name</div>
                    </div>
                </div>

                <div class="main-2">
                    <div class="main-3">
                        <img src="/image/age.png" alt="" class="logo">
                    </div>
                    <div>
                        <div>${age}</div>
                        <div class="description">Age</div>
                    </div>
                </div>

                <div class="main-2">
                    <div class="main-3">
                        <img src="/image/birthday.png" alt="" class="logo">
                    </div>
                    <div>
                        <div>${birthday}</div>
                        <div class="description">Birthday</div>
                    </div>
                </div>

                <div class="main-2">
                    <div class="main-3">
                        <img src="/image/home-profile.png" alt="" class="logo">
                    </div>
                    <div>
                        <div>${city}</div>
                        <div class="description">Lived at</div>
                    </div>
                </div>

                <div class="main-2">
                    <div class="main-3">
                        <img src="/image/gender.png" alt="" class="logo">
                    </div>
                    <div>
                        <div>${gender}</div>
                        <div class="description">Gender</div>
                    </div>
                </div>

                <div class="main-2">
                    <div class="main-3">
                        <img src="/image/relationship.png" alt="" class="logo">
                    </div>
                    <div>
                        <div>${relationship}</div>
                        <div class="description">Relationship</div>
                    </div>
                </div>

                <div class="main-2">
                    <div class="main-3">
                        ${privacyLogo}
                    </div>
                    <div>
                        <div>${privacy}</div>
                        <div class="description">Privacy</div>
                    </div>
                </div>
                
                <div class="title">Contact Info</div>

                <div class="main-2">
                    <div class="main-3">
                        <img src="/image/phone.png" alt="" class="logo">
                    </div>
                    <div>
                        <div>${phone}</div>
                        <div class="description">Mobile</div>
                    </div>
                </div>

                <div class="main-2">
                    <div class="main-3">
                        <img src="/image/email.png" alt="" class="logo">
                    </div>
                    <div>
                        <div>${email}</div>
                        <div class="description">Email</div>
                    </div>
                </div>
            `
            
        }
        else if ( results.data.msg == "private-not-friend" ) {
            document.getElementById("main").innerHTML = `<div id="private-box">
                                                            <div id="private">
                                                                <img src="/image/private.png" alt="" id="private-logo">
                                                                <div>THIS ACCOUNT IS PRIVATE.</div>
                                                            </div>
                                                        </div>`
        }
    })
}







LoadStatus()
LoadProfile()