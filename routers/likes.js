
import express from "express";
import { sequelize } from "../models/models.js";
import Likes from "../models/likes.js"
import { Like_Tag, UnLike_Tag } from "../controllers/History.js";

const router = express.Router();

router.post( "/api/votes", (req,res) => {
    
    Likes.findOne({ where: { username: req.session.user.username, id: req.body.post_id } })
    .then( (results) => {
        if ( results == null ) {
            Likes.create({
                id: req.body.post_id, username: req.session.user.username, status : 1
            })
            .then( (results) => {
                Like_Tag( req.body.post_id, req.session.user.username );
                res.json({status : 1})
            })
        }
        else {
            if ( results.status == 1 ) {
                Likes.update({ status : 0 }, {where: { username: req.session.user.username, id: req.body.post_id }})
                .then( (results) => {
                    UnLike_Tag( req.body.post_id, req.session.user.username );
                    res.json({status : 0})
                })
            }
            else if ( results.status == 0 ) {
                Likes.update({ status : 1 }, {where: { username: req.session.user.username, id: req.body.post_id }})
                .then( (results) => {
                    Like_Tag( req.body.post_id, req.session.user.username );
                    res.json({status : 1})
                })
            }
        }
    })
    .catch((err) => {
        console.log(err)
    })



})

router.get( "/api/checkuserlikes/:post_id", (req,res) => {
    Likes.findOne({ where: { username : req.session.user.username, id: req.params.post_id } })
    .then( (results) => {
        if ( results == null ) {
            res.json({ status: 0 })
        }
        else {
            res.json({ status: results.status })
        }
    })
})

router.get( "/api/countlikes/:post_id", (req,res) => {
    Likes.count({
        where: { id: req.params.post_id, status: 1 }
    })
    .then(count => {
        res.json({ likes_count: count })
    })
})

export default router;