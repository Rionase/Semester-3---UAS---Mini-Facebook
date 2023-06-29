import express from 'express';
import session from 'express-session';

import Auth from './controllers/Auth.js';
import UserRouters from "./routers/users.js";
import ProfileRoutes from "./routers/profile.js";
import PostRoutes from "./routers/posts.js";
import LikeRoutes from "./routers/likes.js";
import BookmarkRoutes from "./routers/bookmarks.js";
import FriendRoutes from "./routers/friends.js";
import Tags from './controllers/Tags.js';







const app = express();
const hostname = '127.0.0.1'
const port = 3000

app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(express.json())

app.use(session({
    secret: 'MiniFacebook', 
    resave: false, 
    saveUninitialized: true, 
    cookie: { maxAge: 100 * 60 * 60 * 1000 } 
}));




app.get( "/", (req,res) => {
    res.redirect("/user/login")
})

// Digunakan cuman dan hanya untuk mengecek apakah TOKEN API dari clarifai masih bisa dipakai/ tidak.
app.get( "/TestApi", (req,res,next) => {
    req.image_path_name = "/image/GambarTesting.jpg";
    next();
}, Tags, (req,res) => {
    res.json(req.tags);
});








// AUTH ada didalam router /user karena tidak semuanya bisa pake AUTH
app.use ( "/user", UserRouters )

app.use ( "/posts", Auth, PostRoutes )

app.use ( "/profile", Auth, ProfileRoutes )

app.use ( "/likes", Auth, LikeRoutes )

app.use ( "/bookmarks" , Auth, BookmarkRoutes )

app.use ( "/friends", Auth, FriendRoutes )





app.get ( "/forbidden", (req,res) => {
    res.render("notfound.ejs", {user: req.session.user || null})
})


app.get("*", (req,res) => {
    res.redirect("/forbidden")
})

app.listen(port, () => {
    console.log(`server running at ${hostname}:${port}`);
})
