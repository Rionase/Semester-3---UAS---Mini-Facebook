
function FetchRequestList() {
    axios.get( "/friends/api/requestlist")
    .then((results) => {
        let data = results.data.data
        if ( data.length == 0 ) {
            document.getElementById("friendRequest").innerHTML = `<div class="no-data">No friend request right now.</div>`
        }
        else {
            for ( let i = 0 ; i < data.length ; i++ ) {
                document.getElementById("friendRequest").innerHTML += `
                    <div class="item" id="user-${data[i].username}">
                        <img src="${data[i].profile}" alt="">
                        <div class="info">
                            <a href="/profile/userprofile/${data[i].username}">
                                <p>${data[i].username}</p>
                            </a>
                            <span class="friend-count">jumlah teman</span>
                            <button class="confirm btn" onclick="ConfirmRequest('${data[i].username}')">Confirm</button>
                            <button class="cancel btn" onclick="DeclineRequest('${data[i].username}')">Decline</button>
                        </div>
                    </div>
                `
                FetchUserLikes( data[i].username )
            }
            
        }
    })
}

function FetchFriendList() {
    axios.get( "/friends/api/friendlist")
    .then((results) => {
        let data = results.data.data
        if ( data.length == 0 ) {
            document.getElementById("friendList").innerHTML = `<div class="no-data">You still doesn't have any friends &#x1F62D;</div>`
        }
        else {
            for ( let i = 0 ; i < data.length ; i++ ) {
                document.getElementById("friendList").innerHTML += `
                    <div class="item" id="user-${data[i].username}">
                        <img src="${data[i].profile}" alt="">
                        <div class="info">
                            <a href="/profile/userprofile/${data[i].username}">
                                <p>${data[i].username}</p>
                            </a>
                            <span class="friend-count">jumlah teman</span>
                            <button class='friends btn'>Friends</button>
                        </div>
                    </div>
                `
                
                FetchUserLikes( data[i].username )
            }
            
        }
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

function FetchUserLikes( username ) {
    axios.get( `/friends/api/userLikes/${username}` )
    .then((results) => {
        document.querySelector( `#user-${username} .friend-count` ).innerHTML = `${results.data.count} friends`
    })
}

document.querySelector( "#friend-request-box button" ).onclick = () => {
    let status = document.querySelector( "#friend-request-box button" ).className
    if ( status == "btn show" ) {
        document.querySelector( "#friend-request-box button" ).className = "btn hidden"
        document.getElementById("friendRequest").style.display = "none"
    }
    else if ( status == "btn hidden" ) {
        document.querySelector( "#friend-request-box button" ).className = "btn show"
        document.getElementById("friendRequest").style.display = ""
    }
}

document.querySelector( "#friend-list-box button" ).onclick = () => {
    let status = document.querySelector( "#friend-list-box button" ).className
    if ( status == "btn show" ) {
        document.querySelector( "#friend-list-box button" ).className = "btn hidden"
        document.getElementById("friendList").style.display = "none"
    }
    else if ( status == "btn hidden" ) {
        document.querySelector( "#friend-list-box button" ).className = "btn show"
        document.getElementById("friendList").style.display = ""
    }
}

FetchRequestList()
FetchFriendList()