
import express from "express";
import { sequelize } from "../models/models.js";
import Sequelize from "sequelize";
import Friend from "../models/friends.js";
import Users from "../models/users.js";

const router = express.Router();

router.get( "/addfriends", (req,res) => {
    Users.findOne({ where: { username: req.session.user.username } })
    .then( (results) => {
        res.render( "addfriend.ejs", { user: results } )
    })
})

router.get( "/api/searchfriends/:count", (req,res) => {
    let offset_count = req.params.count * 5
    sequelize.query(    `SELECT users.username, users.profile, friends.user1, friends.user2, friends.status FROM users
                        LEFT JOIN friends ON (
                            (friends.user1 = users.username AND (friends.user2 = "${req.session.user.username}" OR friends.user2 IS NULL)) OR 
                            (friends.user2 = users.username AND (friends.user1 = "${req.session.user.username}" OR friends.user1 IS NULL))
                        )
                        WHERE (friends.status = 0 OR friends.status IS NULL) AND users.username != "${req.session.user.username}"
                        ORDER BY users.username LIMIT 5 OFFSET ${offset_count} ;`, 
                        { type: sequelize.QueryTypes.SELECT } )
    .then((results) => {
        res.json({ data: results })
    })
})

router.get( "/api/searchfriends/:count/:username", (req,res) => {
    let offset_count = req.params.count * 5
    sequelize.query(    `SELECT users.username, users.profile, friends.user1, friends.user2, friends.status FROM users
                        LEFT JOIN friends ON (
                            (friends.user1 = users.username AND (friends.user2 = "${req.session.user.username}" OR friends.user2 IS NULL)) OR 
                            (friends.user2 = users.username AND (friends.user1 = "${req.session.user.username}" OR friends.user1 IS NULL))
                        )
                        WHERE (friends.status = 0 OR friends.status IS NULL) AND LOWER(users.username) LIKE LOWER('%${req.params.username}%') AND users.username != "${req.session.user.username}"
                        ORDER BY users.username LIMIT 5 OFFSET ${offset_count} ;`, 
                        { type: sequelize.QueryTypes.SELECT } )
    .then( (results) => {
        res.json({ data: results })
    })
})

router.get( "/api/checkStatus/:username", (req,res) => {
    Friend.findOne({
        where: { [Sequelize.Op.or] : [
            { user1: req.session.user.username, user2 : req.params.username },
            { user1: req.params.username, user2: req.session.user.username }
        ]}
    })
    .then( (results) => {
        res.json( results )
    })
})

router.post( "/api/AddFriend/:username", (req,res) => {
    Friend.create({
        user1: req.session.user.username,
        user2: req.params.username,
        status: 0
    })
    .then( (results) => {
        res.json()
    })
})

router.put( "/api/AcceptRequest/:username", (req,res) => {
    Friend.update(
        { status: 1 },
        { where: { user1: req.params.username, user2: req.session.user.username } }
    )
    .then( (results) => {
        res.json()
    })
})

router.delete( "/api/DeclineRequest/:username", (req,res) => {
    Friend.destroy({ where: {
        user1: req.params.username,
        user2: req.session.user.username
    }})
    .then( (results) => {
        res.json()
    })
})

router.delete( "/api/CancelRequest/:username", (req,res) => {
    Friend.destroy({ where: {
        user1: req.session.user.username,
        user2: req.params.username
    }})
    .then( (results) => {
        res.json()
    })
})

router.delete( "/api/Unfriend/:username", (req,res) => {
    Friend.destroy({ where: {
        [Sequelize.Op.or] : [
            { user1: req.session.user.username, user2: req.params.username },
            { user1: req.params.username, user2: req.session.user.username }
        ]
    }})
    .then( (results) => {
        res.json()
    })
})




router.get( "/contact", (req,res) => {
    Users.findOne({ where: { username: req.session.user.username } })
    .then( (results) => {
        res.render( "contact.ejs", { user: results } )
    })
})

router.get( "/api/friendlist", (req,res) => {
    sequelize.query(    `SELECT users.username, users.profile FROM users 
                        INNER JOIN friends ON ((friends.user2 = users.username AND friends.user1 = "${req.session.user.username}") OR (friends.user1 = users.username AND friends.user2 = "${req.session.user.username}"))
                        WHERE friends.status = 1 ORDER BY users.username`,
                        { type: sequelize.QueryTypes.SELECT })
    .then((results) => {
        res.json({ data: results })
    })
})

router.get( "/api/requestlist", (req,res) => {
    sequelize.query(    `SELECT users.username, users.profile, friends.user1, friends.user2, friends.status FROM users
                        INNER JOIN friends ON friends.user1 = users.username
                        WHERE friends.user2 = "${req.session.user.username}" AND friends.status = 0`,
                        { type: sequelize.QueryTypes.SELECT })
    .then((results) => {
        res.json({ data: results })
    })
})

router.get( "/api/userLikes/:username", (req,res) => {
    Friend.count({
        where: {
            [Sequelize.Op.and] : [
                {
                    [Sequelize.Op.or] : [
                        {user1 : req.params.username},
                        {user2 : req.params.username}
                    ]
                },
                { status: 1 }
            ]
        }
    })
    .then((results) => {
        res.json({count : results})
    })
})






router.get( "/friendlistVisitor/:username", (req,res) => {

    Users.findOne({ where: { username: req.params.username } })
    .then( (results1) => {
        sequelize.query(    `SELECT users.username, users.profile, friends.user1, friends.user2, friends.status FROM users
                            INNER JOIN friends ON ((friends.user2 = users.username AND friends.user1 = "${req.params.username}") OR (friends.user1 = users.username AND friends.user2 = "${req.params.username}"))
                            WHERE friends.status = 1 ORDER BY users.username`
                        , { type: sequelize.QueryTypes.SELECT } )
        .then( (results2) => {
            if ( results1.privacy == "Public" ) {
                res.json({ data: results2, msg: "public" })
            }
            else if ( results1.privacy == "Private" ) {
                let Data = results2.filter(item => (item.user1 === req.session.user.username && item.user2 === req.params.username && item.status === 1) || (item.user1 === req.params.username && item.user2 === req.session.user.username && item.status === 1) )
                if ( Data.length == 0 ) {
                    res.json({ "msg": "private-not-friend" })
                }
                else {
                    res.json({ data: results2, msg: "private-friend" })
                }
            }
        })
    })
                        
})

router.get( "/friendlistProfile/:username", (req,res) => {
    Users.findOne({ where: { username: req.params.username } })
    .then( (results1) => {

        sequelize.query(    `SELECT users.username, users.profile, friends.user1, friends.user2, friends.status FROM users
                            INNER JOIN friends ON (friends.user1 = users.username AND friends.user2 = "${req.params.username}" AND friends.status = 1) OR (friends.user2 = users.username AND friends.user1 = "${req.params.username}" AND friends.status = 1)
                            ORDER BY users.username`, { type: sequelize.QueryTypes.SELECT })
        .then( (results2) => {
            
            if ( req.params.username == req.session.user.username ) {
                res.json({ data: results2.slice(0,7), msg: "owner" })
            }
            else if ( results1.privacy == "Public" ) {
                res.json({ data: results2.slice(0,7), msg: "public" })
            }
            else if ( results1.privacy == "Private" ) {
                let Data = results2.filter(item => (item.user1 === req.session.user.username && item.user2 === req.params.username && item.status === 1) || (item.user1 === req.params.username && item.user2 === req.session.user.username && item.status === 1) )
                if ( Data.length == 0 ) {
                    res.json({ "msg": "private-not-friend" })
                }
                else {
                    res.json({ data: results2.slice(0,7), msg: "private-friend" })
                }
            }

        })
    })
})





router.get( "/mutualFriend/:username", (req,res) => {
    sequelize.query(    `SELECT users.username, users.profile FROM users
                        INNER JOIN friends ON (
                            (friends.user1 = users.username AND friends.user2 = "${req.session.user.username}") OR 
                            (friends.user2 = users.username AND friends.user1 = "${req.session.user.username}")
                        )
                        WHERE friends.status = 1 ORDER BY users.username`, 
                        { type: sequelize.QueryTypes.SELECT } )
    .then((results1) => {
        sequelize.query(    `SELECT users.username, users.profile FROM users
                        INNER JOIN friends ON (
                            (friends.user1 = users.username AND friends.user2 = "${req.params.username}") OR 
                            (friends.user2 = users.username AND friends.user1 = "${req.params.username}")
                        )
                        WHERE friends.status = 1 ORDER BY users.username`, 
                        { type: sequelize.QueryTypes.SELECT } )
        .then((results2) => {

            let ArrMutalFriend = []
            for ( let i = 0 ; i < results1.length ; i++ ) {
                for ( let j = 0 ; j < results2.length ; j++ ) {
                    if ( results1[i].username == results2[j].username ) {
                        ArrMutalFriend.push( results1[i] );
                        break
                    }
                }
            }
            res.json({ data: ArrMutalFriend })

        })
    })
})


export default router