function FetchFriend() {
    let searching = document.getElementById("add-friend-searchbar").value ;
    let count = document.getElementById("lazy-loading-id").value ;
    axios.get( `/friends/api/searchfriends/${count}/${searching}` )
    .then((results) => {
        let data = results.data.data

        // Apabila fetching pertama tidak ada data, maka akan muncul tidak ada data
        if ( data.length == 0 && document.getElementById("friend-list").innerHTML == "" ) {
            document.getElementById("friend-list").innerHTML = '<div style="font-size: 20px; margin-top: 20px;">No user detected.</div>'
        }
        // Apabila fetching yang bukan pertama tidak ada data, maka button Load More akan hilang
        else if ( data.length == 0 && document.getElementById("friend-list").innerHTML != "" ) {
            document.getElementById("last-button").style.display = "none"
            document.getElementById("end-data-status").value = "true"
        }
        else {
            // let text = ''
            for ( let i = 0 ; i < data.length ; i++ ) {
                document.getElementById("friend-list").innerHTML += `
                <div class="item" id="user-${data[i].username}">
                    <img src="${data[i].profile}" class="profile">
                    <div class="info">
                        <a href="/profile/userprofile/${data[i].username}">
                            <p>${data[i].username}</p>
                        </a>
                        <span class="friend-count"> friends</span>
                        <div class="main-button"></div>     
                    </div>
                </div>`

                FetchFriendCount( data[i].username )
                // FetchFriendStatus( data[i].username ), FetchFriendStatus harus dilakukan setelah ( didalam ) function CheckMutual
                CheckMutual( data[i].username, data[i].profile )
            }
            document.getElementById("lazy-loading-id").value = parseInt(document.getElementById("lazy-loading-id").value) + 1
        }

        if ( document.getElementById("mutual-list").innerHTML == "" ) {
            document.getElementById("mutual-list").innerHTML = '<div style="font-size: 20px; margin-top: 20px;">No user detected.</div>'
        }
    })
}

function CheckMutual ( username, profile ) {
    axios.get( `/friends/mutualFriend/${username}` )
    .then( (results) => {
        let mutualArr = results.data.data
        if ( mutualArr.length > 0 ) {

            if ( document.getElementById("mutual-list").innerHTML == '<div style="font-size: 20px; margin-top: 20px;">No user detected.</div>' ) {
                document.getElementById("mutual-list").innerHTML = "";
            }

            document.getElementById("mutual-list").innerHTML += `
                <div class="item" id="user-${username}">
                    <img src="${profile}" class="profile">
                    <div class="info">
                        <a href="/profile/userprofile/${username}">
                            <p>${username}</p>
                        </a>
                        <div class="mutualfriend">  
                            <div class="friend-profile"></div>
                            <span class="text">${mutualArr.length} mutual friends</span>
                        </div>
                        <div class="main-button"></div>     
                    </div>
                </div>`

                for ( let i = 0 ; i < mutualArr.length ; i++ ) {
                    if ( i >= 3 ) { break };
                    document.querySelector(`#mutual-list #user-${username} .mutualfriend .friend-profile`).innerHTML += `
                        <a href="/profile/userprofile/${mutualArr[i].username}" title="${mutualArr[i].username}">
                            <img src="${mutualArr[i].profile}">
                        </a>`
                }
        }
        FetchFriendStatus( username )
    })
}

function FetchFriendStatus ( username ) {
    axios.get ( `http://localhost:3000/friends/api/checkStatus/${username}`) 
    .then((results) => {
        if ( results.data == null ) {
            document.querySelector( `#friend-list #user-${username} .main-button` ).innerHTML = `<button class='add btn' onclick='AddFriend("${username}")'>Add Friend</button>`
            // document.querySelector( `#friend-list #user-${username} .main-button` ).innerHTML = "<button class='add btn'>Add Friend</button>"
            // document.querySelector( `#friend-list #user-${username} .add` ).onclick = () => AddFriend(username)

            try {
                document.querySelector( `#mutual-list #user-${username} .main-button` ).innerHTML = `<button class='add btn' onclick='AddFriend("${username}")'>Add Friend</button>`
                // document.querySelector( `#mutual-list #user-${username} .main-button` ).innerHTML = "<button class='add btn'>Add Friend</button>"
                // document.querySelector( `#mutual-list #user-${username} .add` ).onclick = () => AddFriend(username)
            }
            catch{}
        }
        else if ( results.data.status == 0 ) {
            if ( results.data.user2 == username ) {
                document.querySelector( `#friend-list #user-${username} .main-button` ).innerHTML = `<button class='cancel btn' onclick='CancelRequest("${username}")'>Cancel Request</button>`
                // document.querySelector( `#friend-list #user-${username} .main-button` ).innerHTML = "<button class='cancel btn'>Cancel Request</button>"
                // document.querySelector( `#friend-list #user-${username} .cancel` ).onclick = () => CancelRequest(username)

                try {
                    document.querySelector( `#mutual-list #user-${username} .main-button` ).innerHTML = `<button class='cancel btn' onclick='CancelRequest("${username}")'>Cancel Request</button>`
                    // document.querySelector( `#mutual-list #user-${username} .main-button` ).innerHTML = "<button class='cancel btn'>Cancel Request</button>"
                    // document.querySelector( `#mutual-list #user-${username} .cancel` ).onclick = () => CancelRequest(username)
                }
                catch {}
            }
            else if ( results.data.user1 == username ) {
                document.querySelector( `#friend-list #user-${username} .main-button` ).innerHTML = `<button class="confirm btn" onclick='ConfirmRequest("${username}")'>Confirm</button>
                                                                                                    <button class="cancel btn" onclick='DeclineRequest("${username}")'>Decline</button>`
                // document.querySelector( `#friend-list #user-${username} .main-button` ).innerHTML = `<button class="confirm btn">Confirm</button><button class="cancel btn">Decline</button>`
                // document.querySelector( `#friend-list #user-${username} .confirm` ).onclick = () => ConfirmRequest(username)
                // document.querySelector( `#friend-list #user-${username} .cancel` ).onclick = () => DeclineRequest(username)

                try {
                    document.querySelector( `#mutual-list #user-${username} .main-button` ).innerHTML = `<button class="confirm btn" onclick='ConfirmRequest("${username}")'>Confirm</button>
                                                                                                        <button class="cancel btn" onclick='DeclineRequest("${username}")'>Decline</button>`
                    // document.querySelector( `#mutual-list #user-${username} .main-button` ).innerHTML = `<button class="confirm btn">Confirm</button><button class="cancel btn">Decline</button>`
                    // document.querySelector( `#mutual-list #user-${username} .confirm` ).onclick = () => ConfirmRequest(username)
                    // document.querySelector( `#mutual-list #user-${username} .cancel` ).onclick = () => DeclineRequest(username)
                }
                catch {console.log(username, "ada 3")}
            }
        }
        

    })
}

function FetchFriendCount( username ) {
    axios.get ( `/friends/api/userLikes/${username}`) 
    .then((results) => {
        let likes = results.data.count;
        document.querySelector(`#friend-list #user-${username} .friend-count`).innerHTML = `${likes} friends`;
    })
}

function AddFriend ( username ) {
    axios.post( `/friends/api/AddFriend/${username}` )
    .then( (results) => {
        FetchFriendStatus( username )
    })
}

function ConfirmRequest ( username ) {
    axios.put ( `/friends/api/AcceptRequest/${username}` )
    .then( (results) => {
        document.getElementById("lazy-loading-id").value = 0
        document.getElementById("friend-list").innerHTML = ""
        document.getElementById("mutual-list").innerHTML = ""
        FetchFriend()
    })
}

function DeclineRequest ( username ) {
    axios.delete( `/friends/api/DeclineRequest/${username}` )
    .then( (results) => {
        FetchFriendStatus( username )
    })
}

function CancelRequest ( username ) {
    axios.delete( `/friends/api/CancelRequest/${username}` )
    .then( (results) => {
        FetchFriendStatus( username )
    })
}

document.getElementById("add-friend-searchbar").onkeydown = (event) => {
    if ( event.keyCode === 13 ) {
        document.getElementById("lazy-loading-id").value = 0
        document.getElementById("last-button").style.display = ""
        document.getElementById("end-data-status").value = "false"
        document.getElementById("friend-list").innerHTML = ""
        document.getElementById("mutual-list").innerHTML = ""
        FetchFriend()
    }
}

document.getElementById("switch_btn").onclick = () => {
    if ( document.getElementById("switch_btn").checked == true ) {
        document.getElementById("friend-list").style.display = "none"
        document.getElementById("mutual-list").style.display = ""
        if ( document.getElementById("end-data-status").value == "false") {
            document.getElementById("last-button").style.display = "none"
        }
    }
    else {
        document.getElementById("friend-list").style.display = ""
        document.getElementById("mutual-list").style.display = "none"
        if ( document.getElementById("end-data-status").value == "false") {
            document.getElementById("last-button").style.display = ""
        }
    }
}

document.getElementById("load-more-button").onclick = () => {
    FetchFriend()
}

FetchFriend()