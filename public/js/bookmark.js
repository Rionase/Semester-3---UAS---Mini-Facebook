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

function LoadUserBookmarkData () {

    let Count = document.getElementById("lazy-loading-id").value ;
    axios.get( `/bookmarks/api/userBookmarkData/${Count}` )
    .then( (results) => {
        let data = results.data.data


        if ( data.length == 0  && Count == 0 ) {
            document.getElementById("last-button").innerHTML = "No Bookmark added yet."
            document.getElementById("last-button").className = "no-bookmark"
        }
        else if ( data.length == 0 ) {
            document.getElementById("last-button").innerHTML = "No More Bookmark detected."
        }
        else {
            let text = ""
            for ( let i = 0 ; i < data.length ; i++ ) {
                text += 
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
                        <div class='menu'>
                            <i class="fa-solid fa-bookmark" onclick="Bookmark(${data[i].id})"></i>
                        </div>
                    </div>
                    <img src="${data[i].imagepath}">
                    <div class="info">
                        <div class="emoji_img">
                            <img src="image/like.png">
                            <img src="image/haha.png">
                            <img src="image/heart.png">
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
                LoadLikesCount( data[i].id )
            }

            document.getElementById("lazy-loading-id").value = parseInt(document.getElementById("lazy-loading-id").value) + 1 ;
            document.getElementById("main-content").innerHTML += text

        }
    })
    .catch( (err) => {
        console.log(err)
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

function LoadFriendList() {
    axios.get( "/friends/api/friendlist" )
    .then(results => {
        let data = results.data.data
        if ( data.length == 0 ) {
            document.getElementById("left-friend-list").innerHTML += "<br><p>No Friends Detected.</p>"
        }
        else {
            for ( let i = 0 ; i < data.length ; i++ ) {
                document.getElementById("left-friend-list").innerHTML += `
                <div class="contact">
                    <img src="${data[i].profile}">
                    <a href="/profile/userprofile/${data[i].username}">
                        <p>${data[i].username}</p>
                    </a>
                </div>
                `
            }
        }
    })
}

LoadUserBookmarkData ()
LoadFriendList()

document.getElementById("load-more-button").onclick = () => {
    LoadUserBookmarkData()
}