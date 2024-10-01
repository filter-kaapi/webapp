// This file handles api/v1/user API endpoints.
// 1. POST /user - public route that takes in a) email b) password c)firstname d)lastname 
// 2. GET /user/self - Auth route to return respective user details 
// 3. PUT /user/self - Auth route to take in user information and returns respective user details


// User: The model representing the user schema in the database.
// user: The specific instance of the authenticated user that the current request is operating on.


const express = require("express");
const router = express.Router();
const sequelize = require("../database/sequelize");
const User = require("../database/models/user");
const authenticate = require("../middleware/auth");

router.post('/user', async (req, res) => {
    const { email, first_name, last_name, password } = req.body;
    if ( !email 
        ||!first_name
        || !last_name
        || !password) 
    {
        return res.status(400).end()
    }

    // if (!Object.keys(req.body)) {
    //     res.status(400).end()
    // }
   
    
    try {
        const oldUser = await User.findOne({ where: { email } });
        if (oldUser) {
            console.log("user already exists");
            res.status(400).end()
            // User Already Exists 
        }
        
        const newUser = await User.create({
            email:req.body.email,
            first_name: req.body.first_name,
                last_name: req.body.last_name,
                password: req.body.password,
        });
        console.log(newUser.toJSON());

        return res.status(201).json({
            id: newUser.id
        })

    } catch (error) {
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        console.log("---- USER registration CHECK ERROR STARTS----");
        console.log(error)
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        return res.status(400);

    }
});

router.get('/user/self', authenticate, async (req, res) => {
    const user = req.user;
    res.status(200).json({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      account_created: user.account_created,
      account_updated: user.account_updated,
    });
  });

router.put('/user/self', authenticate, async (req, res) => {
    const { email, first_name, last_name, password } = req.body;

    try {
        // console.log(`the body is ${req.body}`);

    const user = req.user;
    // console.log(`the body is ${user}`);
    console.log(`the user is ${req.user}`);

    console.log(`the firstname is ${first_name}`);

    // const { firstName, lastName, password } = req.body;
    // console.log("thth"+firstName);

    // if ( !email 
    //     ||!firstName
    //     || !l
    //     || !password) 
    // {
    //     return res.status(400).end()
    // }
    // try{

        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (password) user.password = password;
        // console.log("Last updated time : "+ User?.updatedAt)
        // await user.save();
        const result = await user.save();
    console.log('Save result:', result);  
        res.status(200).json({
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            // createdAt: User.createdAt,
            // updatedAt: User.updatedAt,
          });
    }
    catch (error) {
        console.error('Error saving user:', error); // Log the error to understand what's happening
        res.status(500).json({ message: 'Error updating user' });
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