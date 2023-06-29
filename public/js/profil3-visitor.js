
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





function LoadFriend() {
    axios.get( `/friends/friendlistVisitor/${ document.getElementById("username-hidden").value }` )
    .then( (results) => {
        
        if ( results.data.msg == "public" || results.data.msg == "private-friend" ) {
            let data = results.data.data
            
            if ( data.length > 0 ) {
                for ( let i = 0 ; i < data.length ; i++ ) {
                    document.getElementById("friend_list").innerHTML += `
                    <div class="item" id="user-${data[i].username}">
                        <img src="${data[i].profile}" alt="">
                        <div class="text">
                            <a href="/profile/userprofile/${data[i].username}">
                                <h2>${data[i].username}</h2>
                            </a>
                            <p class="friend-count">jumlah teman</p>
                        </div>
                    </div>
                    `

                    FetchUserLikes(data[i].username)
                }
            }
            else if ( data.length == 0 ) {
                document.getElementById("main").innerHTML = `<div id="private-box">
                                                                <div id="private">
                                                                    <div>${ document.getElementById("username-hidden").value } doesn't have any friends &#x1F62D;</div>
                                                                </div>
                                                            </div>`
            }
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

function FetchUserLikes( username ) {
    axios.get( `/friends/api/userLikes/${username}` )
    .then((results) => {
        document.querySelector( `#user-${username} .friend-count` ).innerHTML = `${results.data.count} friends`
    })
}








LoadStatus()
LoadFriend()
