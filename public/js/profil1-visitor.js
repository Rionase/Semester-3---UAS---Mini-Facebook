
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






function formatTime(parameter) {
    let now = new Date()
    let CreatedAt = new Date(parameter)
    let seconds = (now - CreatedAt) / 1000
    
    let time = {};
    time.seconds = seconds % 60;
    let minutes = (seconds - time.seconds) / 60;
    time.minutes = minutes % 60;
    let hours = (minutes - time.minutes) / 60;
    time.hours = hours % 24;
    time.days = (hours - time.hours) / 24;
    
    let texttime = ""
    if ( time.days > 0 ) {
        texttime = CreatedAt.toString().slice(4, 15) + " at " + CreatedAt.toString().slice(16, 21)
    }
    else if ( time.hours > 0 ) {
        texttime = Math.round(time.hours) + " hours ago"
    }
    else if ( time.minutes > 0 ) {
        texttime = Math.round(time.minutes) + " mins ago"
    }
    else {
        texttime = Math.round(time.seconds) + " secs ago"
    }
    return texttime

}

function LoadVisitorPost() {
    axios.get( `/posts/api/VisitorPostData/${ document.getElementById("username-hidden").value }` )
    .then((results) => {
        if ( results.data.msg == "public" || results.data.msg == "private-friend" ) {
            let data = results.data.data
            if ( data.length > 0 ) {
                
                for ( let i = 0 ; i < data.length ; i++ ) {
                    document.getElementById("center").innerHTML += 
                    `<div class="friends_post" id="post-${data[i].id}">
                        <input type='hidden' class='posts-id-hidden' value='${data[i].id}'>
                        <div class="friend_post_top">
                            <div class="img_and_name">
                                <img src="${data[i].profile}">
                                <div class="friends_name">
                                    <p class="friends_name">
                                        ${data[i].username}
                                    </p>
                                    <p class="time">${formatTime( data[i].createdAt )}<i class="fa-solid fa-user-group"></i></p>
                                </div>
                            </div>
                            <div class='menu-bookmark'>
                                <i class="fa-regular fa-bookmark" onclick="Bookmark(${data[i].id})"></i>
                            </div>
                        </div>
                        <img src="${data[i].imagepath}">
                        <div class="info">
                            <div class="emoji_img">
                                <img src="/image/like.png">
                                <img src="/image/haha.png">
                                <img src="/image/heart.png">
                                <p class='post-likes'>25k people like your post</p>
                            </div>
                            <div class="comment">
                                <i class="fa-solid fa-thumbs-up like-button" onclick='Likes(${data[i].id})'></i>
                                <p>Like</p>     
                            </div>
                        </div>
                        <hr>
                        <div class="comment_warpper">
                            <div class="comment_search">
                                <div>${data[i].description}</div>
                            </div>
                        </div>
                    </div>`

                    LoadUserLikes( data[i].id )
                    LoadUserBookmark( data[i].id )
                    LoadLikesCount( data[i].id )
                }
                
            }
            else {
                document.getElementById("center").innerHTML = `<div class="friends_post">USER DOESN'T HAVE ANY POST YET.</div>`
            }
        }
        else if ( results.data.msg == "private-not-friend" ) {
            document.getElementsByClassName("main")[0].innerHTML = `<div id="private-box">
                                                                        <div id="private">
                                                                            <img src="/image/private.png" alt="" id="private-logo">
                                                                            <div>THIS ACCOUNT IS PRIVATE.</div>
                                                                        </div>
                                                                    </div>`
        }
    })
}

function LoadUserLikes ( param ) {
    axios.get(`/likes/api/checkuserlikes/${param}`)
    .then((results) => {
        if ( results.data.status == 0 ) {
            document.querySelector(`#post-${param} .like-button`).className = "fa-solid fa-thumbs-up like-button"
        }
        else if ( results.data.status == 1 ) {
            document.querySelector(`#post-${param} .like-button`).className = "fa-solid fa-thumbs-up like-button activi"
        }
    })
}

function LoadUserBookmark ( param ) {
    axios.get(`/bookmarks/api/checkuserBookmarks/${param}`)
        .then((results) => {
            if ( results.data.status == 0 ) {
                document.querySelector(`#post-${param} .fa-bookmark`).className = "fa-bookmark fa-regular"
            }
            else if ( results.data.status == 1 ) {
                document.querySelector(`#post-${param} .fa-bookmark`).className = "fa-bookmark fa-solid"
            }
        })
}

function LoadLikesCount ( param ) {
    axios.get(`/likes/api/countlikes/${param}`)
    .then((results) => {
        document.querySelector(`#post-${param} .post-likes`).innerHTML = results.data.likes_count + " people likes this post."
    })
}

function Likes( param ) {
    axios.post( "/likes/api/votes", {
        post_id: param
    })
    .then( (results) => {  
        if ( results.data.status == 1 ) {
            document.querySelector(`#post-${param} .like-button`).className = "fa-solid fa-thumbs-up like-button activi"
        }
        else if ( results.data.status == 0 ) {
            document.querySelector(`#post-${param} .like-button`).className = "fa-solid fa-thumbs-up like-button"
        }
        LoadLikesCount( param )
    })
}

function Bookmark( param ) {
    axios.post( "/bookmarks/api/votes", {
        post_id: param
    })
    .then( (results) => {
            if ( results.data.status == 1 ) {
                document.querySelector(`#post-${param} .fa-bookmark`).className = "fa-bookmark fa-solid"
            }
            else if ( results.data.status == 0 ) {
                document.querySelector(`#post-${param} .fa-bookmark`).className = "fa-bookmark fa-regular"
            }
    })
}

LoadStatus()
LoadVisitorPost()