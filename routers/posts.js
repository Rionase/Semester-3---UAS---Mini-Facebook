import express from "express";
import Posts from "../models/posts.js";
import upload from "../controllers/Upload.js";
import Users from "../models/users.js";
import { sequelize } from "../models/models.js";
import Tags from "../controllers/Tags.js";
import { Saved_History } from "../controllers/History.js";

const router = express.Router();

router.get( "/" , Saved_History, (req,res) => {
    Users.findOne({ where: { username: req.session.user.username } })
    .then( (results) => {
        res.render( "home.ejs", { user: results, search: req.query.search || "" } )
    })
})

router.get( "/upload", ( req,res ) => {
    Users.findOne({ where: { username: req.session.user.username } })
    .then( (results) => {
        res.render( "upload.ejs", { user: results } )
    })
})

router.post( "/api/upload", [ upload.single("image") , Tags ] , (req,res) => {
    Posts.create({ 
        username: req.session.user.username,
        imagepath: req.image_path_name,
        description: req.body.description,
        tags: req.tags
    })
    .then( (results) => {
        res.send().status(200)
    })
})

router.put( "/api/:posts_id", [ upload.single("image") , Tags ], (req,res) => {
    Posts.update({ 
        imagepath: req.image_path_name,
        description: req.body.description,
        tags: req.tags
    }, { where: { id: req.params.posts_id }})
    .then( (results) => {
        res.json()
    })
})

router.get( "/edit/:posts_id", (req,res) => {

    sequelize.query( `SELECT users.profile, posts.id, posts.username, posts.imagepath, posts.description FROM users INNER JOIN posts ON users.username = posts.username WHERE posts.id = ${req.params.posts_id}`, { type: sequelize.QueryTypes.SELECT } )
    .then( (results) => {
        // Apabila data postingan ada
        if ( results.length > 0 ) {
            // Klo bukan owner dari post, gabisa edit postingan
            if ( results[0].username == req.session.user.username ) {
                res.render( "editpost.ejs", { data: results[0] } )
            }
            else {
                res.redirect("/forbidden")
            }
        }
        else {
            res.redirect("/forbidden")
        }
    })
    
})

router.get( "/api/owner", (req,res) => {
    sequelize.query( `SELECT posts.id ,posts.username, posts.imagepath, posts.description, posts.createdAt, users.profile FROM posts INNER JOIN users ON users.username = posts.username WHERE posts.username = '${req.session.user.username}' GROUP BY posts.id DESC` , { type: sequelize.QueryTypes.SELECT })
    .then( (results) => {
        res.json({ data: results })
    })
})

router.get( "/api/allpost/:offset/",  (req,res) => {
    let offset_count = req.params.offset * 10

    if ( req.query.search == "" ) {
        let CaseHistory = "";
        if ( req.session.user.history.length > 0 ) {
            CaseHistory += "CASE "
            let dataHistory = req.session.user.history
            let i = 0 ;
            for ( i ; i < dataHistory.length ; i++ ) {
                CaseHistory += `WHEN posts.tags LIKE "%${dataHistory[i].tag}%" THEN ${i+1} `
            }
            CaseHistory += `ELSE ${i+1} END,`
        }
        sequelize.query(    `SELECT users.username, users.profile, users.privacy, posts.id, posts.imagepath, posts.description, posts.createdAt, friends.user1, friends.user2, friends.status, posts.tags FROM users
                            INNER JOIN posts ON posts.username = users.username
                            LEFT JOIN friends ON friends.user1 = users.username OR friends.user2 = users.username
                            WHERE users.username != "${req.session.user.username}" AND ( users.privacy = "Public" OR ( users.privacy = "Private" AND friends.user1 = "${req.session.user.username}" AND friends.status = 1 ) OR ( users.privacy = "Private" AND friends.user2 = "${req.session.user.username}" AND friends.status = 1 ) )
                            GROUP BY posts.id ORDER BY ${CaseHistory} posts.id DESC LIMIT 10 OFFSET ${offset_count} ;`
                            , { type: sequelize.QueryTypes.SELECT })
        .then( (results) => {
            res.json({ data: results })
        })
    }

    else {
        let CaseSearch = "CASE ";
        let dataHistory = req.query.search.split(" ")
        let filteredDataHistory = dataHistory.filter(item => item !== '');
        let i = 0 ;
        for ( i ; i < filteredDataHistory.length ; i++ ) {
            CaseSearch += `WHEN posts.tags LIKE "%${filteredDataHistory[i]}%" OR LOWER(posts.description) LIKE LOWER("%${filteredDataHistory[i]}%") THEN ${i+1} `
        }
        CaseSearch += `ELSE ${i+1} END,`
        sequelize.query(    `SELECT users.username, users.profile, users.privacy, posts.id, posts.imagepath, posts.description, posts.createdAt, friends.user1, friends.user2, friends.status, posts.tags FROM users
                            INNER JOIN posts ON posts.username = users.username
                            LEFT JOIN friends ON friends.user1 = users.username OR friends.user2 = users.username
                            WHERE users.username != "${req.session.user.username}" AND ( users.privacy = "Public" OR ( users.privacy = "Private" AND friends.user1 = "${req.session.user.username}" AND friends.status = 1 ) OR ( users.privacy = "Private" AND friends.user2 = "${req.session.user.username}" AND friends.status = 1 ) )
                            GROUP BY posts.id ORDER BY ${CaseSearch} posts.id DESC LIMIT 10 OFFSET ${offset_count} ;`
                            , { type: sequelize.QueryTypes.SELECT })
        .then( (results) => {
            res.json({ data: results })
        })
    }

})



router.delete("/api/delete/:post_id",(req,res)=>{
    Posts.destroy({
        where: {
          id: req.params.post_id
        }
    }).then((results)=>{
        res.send().status(200)
    }).catch(err=>{
        console.log(err)
    })
})





router.get( "/api/VisitorPostData/:username", (req,res) => {
    sequelize.query(`SELECT users.username ,users.privacy, friends.user1, friends.user2, friends.status FROM users
                    LEFT JOIN friends ON ((friends.user1 = users.username) OR (friends.user2 = users.username))
                    WHERE users.username = "${req.params.username}"`
                    , { type: sequelize.QueryTypes.SELECT })
    .then( (results1) => {
        if ( results1[0].privacy == "Public" ) {
            sequelize.query( `SELECT posts.id ,posts.username, posts.imagepath, posts.description, posts.createdAt, users.profile FROM posts INNER JOIN users ON users.username = posts.username WHERE posts.username = '${req.params.username}' GROUP BY posts.id DESC` , { type: sequelize.QueryTypes.SELECT })
            .then( (results2) => {
                res.json({ data: results2, msg: "public" })
            })
        }
        else if ( results1[0].privacy == "Private" ) {
            let Data = results1.filter(item => (item.user1 === req.session.user.username && item.user2 === req.params.username && item.status === 1) || (item.user1 === req.params.username && item.user2 === req.session.user.username && item.status === 1) )
            if ( Data.length == 0 ) {
                res.json({ msg: "private-not-friend" })
            }
            else if ( Data.length > 0 ) {
                sequelize.query( `SELECT posts.id ,posts.username, posts.imagepath, posts.description, posts.createdAt, users.profile FROM posts INNER JOIN users ON users.username = posts.username WHERE posts.username = '${req.params.username}' GROUP BY posts.id DESC` , { type: sequelize.QueryTypes.SELECT })
                .then( (results2) => {
                    res.json({ data: results2, msg: "private-friend" })
                })
            }
        }
        
    })

})

export default router