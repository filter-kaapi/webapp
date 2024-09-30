// This file handles api/v1/user API endpoints.

const express = require("express");
const router = express.Router();
const sequelize = require("../database/sequelize");
const User = require("../database/models/user")

router.post('/user', async (req, res) => {

    const { email, first_name, last_name, password } = req.body;


    if (!Object.keys(req.body)) {
        return res.sendStatus(400)
    }
    if (!email 
        ||!first_name
        || !last_name
        || !password
    ) {
        return res.sendStatus(400)
    }
    try {

        const oldUser = await User.findOne({ where: { email } });
        if (oldUser) {
            console.log("user alteady exists");
            return res.status(400);
            // User Already Exists 
        }
        const newUser = await User.create({
            email:req.body.email,
            firstName: req.body.first_name,
                lastName: req.body.last_name,
                password: req.body.password,
        });
        console.log(newUser.toJSON());

        return res.status(201).json({
            id: newUser.id
        })



        // if (Object.keys(req.body)) {
        //     console.log("---- /user if loop ----");
        //     console.log(req.body)
        //     console.log(req.body.email)

        //     const newUser = await User.create({
        //         email: req.body.email,
        //         firstName: req.body.first_name,
        //         lastName: req.body.last_name,
        //         password: req.body.password,
        //     });
        //     console.log(newUser.toJSON());
        //     return res.sendStatus(201).json(newUser);
        // }

        // else {
        //     console.log("---- /user else loop ----");
        //     return res.sendStatus(400);
        // }

    } catch (error) {
        console.log("---- HEALTH CHECK ERROR STARTS----");
        console.log(error)

    }
});
// router.get('/user' , async (req,res) =>{
//     // return res
//     // .status(200)
//     // .json({"test": "works"})
//     // .end()

//     res.send("thisworks")
// })
// // router.post('/user', async (req,res) =>{
//     console.log(req);
//     console.log("----------- user route----")
//     console.log(req.body);
//     // const { email, firstname, lastname, password } = req.body;
// } )

module.exports = router;