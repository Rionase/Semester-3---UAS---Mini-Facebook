
function FetchFriendList() {
    axios.get( "/friends/api/friendlist")
    .then((results) => {
        let data = results.data.data
        if ( data.length == 0 ) {
            document.getElementById("main").innerHTML = `<div id="private-box">
                                                            <div id="private">
                                                                <div>You still doesn't have any friends &#x1F62D;</div>
                                                            </div>
                                                        </div>`
        }
        else {
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
                
                FetchUserLikes( data[i].username )
            }
            
        }
    })
}

function FetchUserLikes( username ) {
    axios.get( `/friends/api/userLikes/${username}` )
    .then((results) => {
        document.querySelector( `#user-${username} .friend-count` ).innerHTML = `${results.data.count} friends`
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


FetchFriendList()