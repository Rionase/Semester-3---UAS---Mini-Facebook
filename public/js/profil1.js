
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

function post(){
    axios.get( "/posts/api/owner")
    .then( (results) => {
        let arr = results.data.data
        console.log(arr)
        if ( arr.length > 0 ) {
            arr.forEach(element => {
                document.getElementById("center").innerHTML +=
                `<input type="hidden" class="posts-id-hidden" value="${element.id}">
                <div class="friends_post">
    
                <div class="friend_post_top">
    
                    <div class="img_and_name">
    
                        <img src="${element.profile}">
    
                        <div class="friends_name">
                            <p class="friends_name">
                                ${element.username}
                            </p>
                            <p class="time">${formatTime(element.createdAt)}<i class="fa-solid fa-user-group"></i></p>
                        </div>
                        
    
                    </div>
                    
                    <div class="menu">
                        <a href="/posts/edit/${element.id}"><i class="fa-regular fa-pen-to-square"></i></a>
                        <i class="fa-solid fa-trash-can" onclick="delete_post(${element.id})"></i>
                    </div>
    
                </div>
    
                <img src="${element.imagepath}">
    
                <div class="info">
    
                    <div class="emoji_img">
                        <img src="/image/like.png">
                        <img src="/image/haha.png">
                        <img src="/image/heart.png">
                        <p class='posts-like'>You, Charith Disanayaka and 25K others</p>
                    </div>
    
                </div>
    
                <hr>
                <div class="comment_warpper">
                        <div class="comment_search">
                            <div>${element.description}</div>
                        </div>
    
                    </div>
            </div>`
            });
            LoadLikesCount()
        }
        else {
            document.getElementById("center").innerHTML = `<div class="friends_post">USER DOESN'T HAVE ANY POST YET.</div>`
        }
        
    })
    .catch( (err) => {
        console.log(err)
    })
}

function LoadLikesCount() {
    let Arr = document.getElementsByClassName("posts-id-hidden");
    for ( let i = 0 ; i < Arr.length ; i++ ) {
        axios.get(`/likes/api/countlikes/${Arr[i].value}`)
        .then((results) => {
            document.getElementsByClassName("posts-like")[i].innerHTML = results.data.likes_count + " people likes yout post."
        })
    }
}

function delete_post(id){
    axios.delete( `/posts/api/delete/${id}`)
    .then((results)=>{
        window.location.reload()
    })
    .catch(err=>{
        console.log(err)
    })
}


post()