import express from "express";
import crypto from "crypto";
import Users from "../models/users.js";
import Auth from "../controllers/Auth.js";

const router = express.Router();




router.get("/login", Auth, (req,res) => {
    res.render("login.ejs")
})

router.get("/signup", Auth, (req,res) => {
    res.render("signup.ejs")
})

router.get("/username/:username", (req,res) => {
    Users.findOne({ where: { username: req.params.username } })
    .then( (results) => {
        
        if ( results ) {
            res.json({ username: "Registered" })
        }
        else {
            res.json({ username: "Not Registered" })
        }
    })
})

router.post("/signup", (req,res) => {
    Users.create({
        username: req.body.username ,
        password: crypto.createHash("md5").update(req.body.password).digest("hex") ,
        email: req.body.email ,
        birthday: req.body.birthday ,
        name: req.body.username
    })
    .then( (results) => {
        // SESSION DIBUAT SAAT USER SIGN UP
        req.session.user = { username: results.username }
        res.send().status(200)
    })
})

router.post("/login", (req,res) => {
    Users.findOne({ where: { username: req.body.username, password: crypto.createHash("md5").update(req.body.password).digest("hex") } })
    .then((results) => {
        if ( results ) {
            // SESSION DIBUAT SAAT USER LOG IN
            req.session.user = { username: results.username }
            res.json({ status: "Passed" })
        }
        else {
            res.json({ status: "Not Passed" })
        }
    })
})

router.get("/logout", (req,res) => {
    req.session.destroy()
    res.redirect("/")
})

export default router