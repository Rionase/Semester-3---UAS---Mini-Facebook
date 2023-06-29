document.querySelector(".search_bar input").onkeydown = (event) => {
    if ( event.keyCode === 13 ) {
        let searchdata = document.querySelector(".search_bar input").value;
        window.location.href = `/posts?search=${searchdata}`
    }
}