// This file handles api/v1/user API endpoints.

const express =  require ("express");
const router = express.Router();
const sequelize = require("../database/sequelize");

router.get('/user', async (req, res) => {
    try {
        if (Object.keys(req.query).length <= 0) {
            return res.send(400)
            // .status(400),
            // .end();
        }
        else {
            
        }
            
    } catch (error)  {
        console.log("---- HEALTH CHECK ERROR STARTS----");

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