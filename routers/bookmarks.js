
import express from "express";
import { sequelize } from "../models/models.js";
import Bookmark from "../models/bookmarks.js"
import Users from "../models/users.js";
import { Bookmark_Tag, UnBookmark_Tag } from "../controllers/History.js";

const router = express.Router();

router.get( "/", (req,res) => {
    Users.findOne({ where: { username: req.session.user.username } })
    .then( (results) => {
        res.render( "bookmark.ejs", { user: results } )
    })
})

router.get( "/api/userBookmarkData/:offset" , (req,res) => {
    let offset_count = req.params.offset * 10
    sequelize.query(    `SELECT posts.id, posts.username, posts.imagepath, posts.description, posts.createdAt, users.profile FROM users 
                        INNER JOIN posts ON posts.username = users.username 
                        INNER JOIN bookmarks ON bookmarks.id = posts.id 
                        WHERE bookmarks.username = "${req.session.user.username}" AND bookmarks.status = 1
                        ORDER BY posts.id DESC
                        LIMIT 10 OFFSET ${offset_count}`, { type: sequelize.QueryTypes.SELECT } )
    .then( (results) => {
        res.json({ data: results })
    })
    .catch( (err) => {
        console.log(err)
    })
})

router.post( "/api/votes", (req,res) => {
    
    Bookmark.findOne({ where: { username: req.session.user.username, id: req.body.post_id } })
    .then( (results) => {
        if ( results == null ) {
            Bookmark.create({
                id: req.body.post_id, username: req.session.user.username, status : 1
            })
            .then( (results) => {
                Bookmark_Tag( req.body.post_id, req.session.user.username );
                res.json({status : 1})
            })
        }
        else {
            if ( results.status == 1 ) {
                Bookmark.update({ status : 0 }, {where: { username: req.session.user.username, id: req.body.post_id }})
                .then( (results) => {
                    UnBookmark_Tag( req.body.post_id, req.session.user.username );
                    res.json({status : 0})
                })
            }
            else if ( results.status == 0 ) {
                Bookmark.update({ status : 1 }, {where: { username: req.session.user.username, id: req.body.post_id }})
                .then( (results) => {
                    Bookmark_Tag( req.body.post_id, req.session.user.username );
                    res.json({status : 1})
                })
            }
        }
    })
    .catch((err) => {
        console.log(err)
    })



})

router.get( "/api/checkuserBookmarks/:post_id", (req,res) => {
    Bookmark.findOne({ where: { username : req.session.user.username, id: req.params.post_id } })
    .then( (results) => {
        if ( results == null ) {
            res.json({ status: 0 })
        }
        else {
            res.json({ status: results.status })
        }
    })
})

export default router;