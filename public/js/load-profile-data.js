function LoadFriendOnProfile() {
    axios.get( `/friends/friendListProfile/${ document.getElementById("username-hidden").value }` )
    .then( results => {
        if ( results.data.msg == "owner" || results.data.msg == "public" || results.data.msg == "private-friend" ) {
            let data = results.data.data
            if ( data.length == 0 ) {
                // UBAH INI
                document.getElementById("friend-profile").remove()
            }
            else {
                let text = ""
                for ( let i = 0 ; i < data.length ; i++ ) {
                    text += `<a href="/profile/userprofile/${data[i].username}"><img src="${data[i].profile}" ></a>`
                }
                document.getElementById("friend-profile").innerHTML = text ;
            }
        }
        else if ( results.data.msg == "private-not-friend" ) {
            // UBAH INI
            document.getElementById("friend-profile").remove()
        }
    })
}

function LoadFriendCount() {
    axios.get( `/friends/api/userLikes/${ document.getElementById("username-hidden").value }` )
    .then((results) => {
        document.getElementById("profile-friend-count").innerHTML = `${results.data.count} friends`
    })
}



LoadFriendOnProfile()
LoadFriendCount()