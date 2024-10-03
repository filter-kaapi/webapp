// This file handles api/v1/user API endpoints.
// 1. POST /user - public route that takes in a) email b) password c)firstname d)lastname 
// 2. GET /user/self - Auth route to return respective user details 
// 3. PUT /user/self - Auth route to take in user information and returns respective user details


// User: The model representing the user schema in the database.
// user: The specific instance of the authenticated user that the current request is operating on.


const express = require("express");
const router = express.Router();
const User = require("../database/models/user");
const authenticate = require("../middleware/auth");


// PUBLIC Routes 
// 1. PSOT /user - Responds with 201 User created and 400 Bad request


router.post('/user', async (req, res) => {
    if (Object.keys(req.params).length > 0 || Object.keys(req.query).length > 0) {
        return res.status(400).end();

    }

    const { email, first_name, last_name, password } = req.body;
    if (!email || !first_name || !last_name || !password) {
        return res.status(400).end()
    }
    if (req.body.password.length <= 5) {
        console.log("Passsword too short")
        return res.status(400).end()
        // return res.status(400).json({ error: "Password too small" })
        // Purposefully keeping this error for better ux. NOT. safe zone removing json 


    }
    try {
        const oldUser = await User.findOne({ where: { email } });
        if (oldUser) {
            console.log("user already exists");
            res.status(400).end()
            // User Already Exists 
        }

        const newUser = await User.create({
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password,
        });
        console.log(newUser.toJSON());
        return res.status(201).json({
            id: newUser.id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            account_created: newUser.account_created,
            account_updated: newUser.account_updated

        })
    } catch (error) {
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        console.log("---- USER registration CHECK ERROR STARTS----");
        console.log(error)
        console.log("~~~~~~~~~USER registration CHECK ERROR ENDS~~~~~~~~~~~~~~")
        return res.status(400).end()

    }
});
// AUTHENTICATED routes
// 1. GET /user/self - Responds with 200 OK with all details 
// 2. PUT /user/self - Responds with 204 and 400 without any details 

router.get('/user/self', authenticate, async (req, res) => {

    console.log("inside get");

    if (req.method == "HEAD") {
        console.log(req.method)
        return res.status(405).end();

    }
    if ((Object.keys(req.query).length > 0) || (Object.keys(req.params).length > 0)) {
        return res.status(400).end();
    }



    if (Object.keys(req.body).length > 0) {
        console.log(req.body)
        return res.status(400).end();

    }
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

    const itemsinBody = Object.keys(req.body);
    console.log("dfdfdfdf" + itemsinBody)
    let invalidFields = []
    for (let i = 0; i < itemsinBody.length; i++) {
        const key = itemsinBody[i]
        if (key !== "first_name" && key !== "last_name" && key !== "password") {
            invalidFields.push(key);
        }
    }
    if (invalidFields.length > 0) {
        console.log(invalidFields.length + "its not zero so sending 400")
        return res.status(400).end();
    }

    if (Object.keys(req.params).length > 0 || Object.keys(req.query).length > 0) {
        return res.status(400).end();
    }
    if (req.body.account_updated || req.body.account_created) {
        return res.status(400).end();
    }
    try {
        const user = req.user;

        console.log(`the user is ${req.user.email}`);
        console.log(`the firstname is ${first_name}`);
        if (email) { res.status(400).end() }
        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (password) user.password = password;
        const result = await user.save();
        console.log('Save result:', result);
        res.status(204).end(); // No content - as per swagger
    }
    catch (error) {
        console.error('Error saving user:', error);
        res.status(400).end(); // Bad Request - as per swagger
    }
});

// NOT_SUPPORTED ROUTES for /user/self - Respond with 405
// 1. DELETE 
// 2. HEAD
// 3. OPTIONS 
// 4. PATCH

router.delete('/user/self', async (req, res) => {
    res.status(405).end()
});
router.head('/user/self', async (req, res) => {
    res.status(405).end()
});
router.options('/user/self', async (req, res) => {
    res.status(405).end()
});
router.patch('/user/self', async (req, res) => {
    res.status(405).end()
});
router.post('/user/self', async (req, res) => {
    res.status(405).end()
});



// NOT_SUPPORTED ROUTES for /user - Respond with 405
// 1. DELETE 
// 2. HEAD
// 3. OPTIONS 
// 4. PATCH
// 5. GET
// 6. PUT


router.delete('/user', async (req, res) => {
    res.status(405).end()
});
router.head('/user', async (req, res) => {
    res.status(405).end()
});
router.options('/user', async (req, res) => {
    res.status(405).end()
});
router.patch('/user', async (req, res) => {
    res.status(405).end()
});
router.get('/user', async (req, res) => {
    res.status(405).end()
});
router.put('/user', async (req, res) => {
    res.status(405).end()
});




module.exports = router;