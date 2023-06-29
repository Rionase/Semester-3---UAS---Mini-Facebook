import upload from "../controllers/Upload.js";
import express, { Router } from "express";
import Users from "../models/users.js";
import { sequelize } from "../models/models.js";

const router = express.Router();

router.get( "/userpost/:username", (req,res) => {
    Users.findOne({ where: { username: req.params.username } })
    .then( (results) => {

        if ( req.params.username == req.session.user.username ) {
            res.render( "profil1.ejs", { user: results } )
        }
        else {
            res.render( "profil1-visitor.ejs", { user: results })
        }

    })
})

router.get( "/userprofile/:username", (req,res) => {
    Users.findOne({ where: { username: req.params.username } })
    .then( (results) => {

        if ( req.params.username == req.session.user.username ) {
            let birthday = new Date(results.birthday);
            let now = new Date();
            let TimeDiff = ( now - birthday ) / (1000 * 60 * 60 * 24 * 365)
            results.age = Math.round( TimeDiff )

            let options = { year: 'numeric', month: 'long', day: 'numeric' };
            let formattedDate = birthday.toLocaleDateString('id-ID', options);
            results.birthday = formattedDate;

            res.render( "profil2.ejs", { user: results } )
        }
        else {
            res.render( "profil2-visitor.ejs", { user: results } )
        }

    })
})

router.get( "/edit", (req,res) => {
    Users.findOne({ where: { username: req.session.user.username } })
    .then( (results) => {

        let birthday = new Date(results.birthday);
        let now = new Date();
        let TimeDiff = ( now - birthday ) / (1000 * 60 * 60 * 24 * 365)
        results.age = Math.round( TimeDiff )

        let options = { year: 'numeric', month: 'long', day: 'numeric' };
        let formattedDate = birthday.toLocaleDateString('id-ID', options);
        results.birthday = formattedDate;

        res.render( "profil-edit.ejs", { user: results } )

    })
})

router.get( "/userfriend/:username", (req,res) => {
    Users.findOne({ where: { username: req.params.username } })
    .then( (results) => {

        if ( req.params.username == req.session.user.username ) {
            res.render( "profil3.ejs", { user: results} )
        }
        else {
            res.render( "profil3-visitor.ejs", { user: results} )
        }

        

    })
})

router.post( "/editprofile",  upload.single("image") , (req,res) => {

    Users.update({ profile: req.image_path_name }, { where : { username: req.session.user.username } })
    .then((results) => {
        res.json({ "msg" : "berhasil"})
    })
    
})

router.put( "/userprofile", (req,res) => {
    Users.update( req.body, { where: { username: req.session.user.username } } )
    .then( (results) => {
        res.send().status(200)
    })
    .catch( (err) => {
        res.send().status(502)
    })
})

router.get( "/userprofileData/:username", (req,res) => {
    sequelize.query(    `SELECT users.username, users.email, users.birthday, users.name, users.city, users.phone, users.gender, users.relationship, users.profile, users.privacy, friends.user1, friends.user2, friends.status FROM users 
                        LEFT JOIN friends on ((users.username = friends.user1) OR (users.username = friends.user2))
                        WHERE users.username = "${req.params.username}"`
                        , { type: sequelize.QueryTypes.SELECT } )
    .then( (results1) => {
        if ( results1[0].privacy == "Public" ) {

            let birthday = new Date(results1[0].birthday);
            let now = new Date();
            let TimeDiff = ( now - birthday ) / (1000 * 60 * 60 * 24 * 365)
            results1[0].age = Math.round( TimeDiff )

            let options = { year: 'numeric', month: 'long', day: 'numeric' };
            let formattedDate = birthday.toLocaleDateString('id-ID', options);
            results1[0].birthday = formattedDate;

            res.json({ data: results1[0], msg: "public" })
        }
        else if ( results1[0].privacy == "Private" ) {
            let Data = results1.filter(item => (item.user1 === req.session.user.username && item.user2 === req.params.username && item.status === 1) || (item.user1 === req.params.username && item.user2 === req.session.user.username && item.status === 1) )
            if ( Data.length == 0 ) {
                res.json({ msg: "private-not-friend" })
            }
            else if ( Data.length > 0 ) {

                let birthday = new Date(Data[0].birthday);
                let now = new Date();
                let TimeDiff = ( now - birthday ) / (1000 * 60 * 60 * 24 * 365)
                Data[0].age = Math.round( TimeDiff )

                let options = { year: 'numeric', month: 'long', day: 'numeric' };
                let formattedDate = birthday.toLocaleDateString('id-ID', options);
                Data[0].birthday = formattedDate;

                res.json({ data: Data[0], msg: "private-friend" })
            }
        }
        
    })
})



export default router

