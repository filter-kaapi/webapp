// This file handles api/v1/user API endpoints.
// 1. POST /user - public route that takes in a) email b) password c)firstname d)lastname
// 2. GET /user/self - Auth route to return respective user details
// 3. PUT /user/self - Auth route to take in user information and returns respective user details

// User: The model representing the user schema in the database.
// user: The specific instance of the authenticated user that the current request is operating on.

const express = require("express");
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { models } = require('../database/sequelize');
const User = models.User;
const authenticate = require("../middleware/auth");
const upload = require("../middleware/fileUpload");
const {
    DeleteObjectCommand,
    CreateMultipartUploadCommand,
    PutObjectCommand,
    GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const path = require("path");
const UserProfilePic = require("../database/models/userProfilePic");
const client = require("../metrics/metrics")
const snsTopicArn = process.env.SNS_TOPIC_ARN;
const AWS = require("../aws/awsconfig")

const snsClient = new SNSClient({ region: process.env.AWS_REGION });

// function verificationhexcode(length) {
//     let result = '';
//     const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
//     for (let i = 0; i < length; i++) {
//         result += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//     return result;
// }



// PUBLIC Routes
// 1. POST /user - Responds with 201 User created and 400 Bad request

router.post("/user", async (req, res) => {
    client.increment('api.v1.user.post');  // Increment call count for POST /user
    const start = Date.now();


    if (Object.keys(req.params).length > 0 || Object.keys(req.query).length > 0) {
        return res.status(400).end();
    }

    const { email, first_name, last_name, password } = req.body;
    if (!email || !first_name || !last_name || !password) {
        return res.status(400).end();
    }
    if (req.body.password.length <= 5) {
        console.log("Passsword too short");
        return res.status(400).end();
        // return res.status(400).json({ error: "Password too small" })
        // Purposefully keeping this error for better ux. NOT. safe zone removing json
    }
    try {
        const oldUser = await User.findOne({ where: { email } });
        if (oldUser) {
            console.log("user already exists");
            res.status(400).end();
            // User Already Exists
        }
        // const hexCode = verificationhexcode(8); // Generate a 6-character hex code
        // console.log(hexCode + "from console");
        const verificationToken = uuidv4();
        const tokenExpiration = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes from now

        const newUser = await User.create({
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password,
            verification_string: verificationToken,
            verification_string_expiration: tokenExpiration,
            is_verified: false
        });



        const snsPayload = {
            email: newUser.email,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            verification_token: verificationToken,
            verification_string_expiration: tokenExpiration.toISOString()
        };

        const snsCommand = new PublishCommand({
            TopicArn: snsTopicArn,
            Message: JSON.stringify(snsPayload),
            Subject: "User Verification",
        });

        const response = await snsClient.send(snsCommand);
        console.log('Successfully published to SNS:', response.MessageId);


        console.log(newUser.toJSON());
        console.log(newUser.verification_string + "from newUser")
        console.log(newUser.verification_string_expiration + "registration time")
        client.timing('api.user.post.response_time', Date.now() - start);  // Track response time
        return res.status(201).json({
            id: newUser.id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            account_created: newUser.account_created,
            account_updated: newUser.account_updated,
        });
    } catch (error) {
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log("---- USER registration CHECK ERROR STARTS----");
        console.log(error);
        console.log("~~~~~~~~~USER registration CHECK ERROR ENDS~~~~~~~~~~~~~~");
        return res.status(400).end();
    }
});

router.get('/verify', async (req, res) => {
    try {
        const { token } = req.query;
        console.log(token + "fromverification")
        if (!token) {
            return res.status(400).json({ error: 'Verification token is required' });
        }

        const now = new Date();

        const [updatedRows] = await User.update(
            {
                is_verified: true,
                verification_string: null,
                verification_string_expiration: null
            },
            {
                where: {
                    verification_string: token,
                    verification_string_expiration: { [Op.gt]: now },
                    is_verified: false
                }
            }
        );

        if (updatedRows === 0) {
            return res.status(410).end();
        }

        return res.status(200).json({ message: 'Account successfully verified' });
    } catch (error) {
        console.error('Error verifying user:', error);
        return res.status(400).end()
    }
});

// AUTHENTICATED routes
// 1. GET /user/self - Responds with 200 OK with all details
// 2. PUT /user/self - Responds with 204 and 400 without any details, ignore the email added.
// 3. POST /user/self/pic - Responds with 201 Profile Pic Added/Updated with file_name, id, url, upload_date, user_id and 400 BadRequest without any details.
// 4. GET /user/self/pic - 200 OK with all details and 404 Not Found
// 5. DELETE /user/self/pic - 204 (no content) for sucess, 401 for Unauthorized, 404 if not found.

router.get("/user/self", authenticate, async (req, res) => {
    console.log("inside get");
    client.increment('api.v1.user.get_self');  // Increment call count for GET /user/self
    const start = Date.now();

    if (req.method == "HEAD") {
        console.log(req.method);
        return res.status(405).end();
    }
    if (Object.keys(req.query).length > 0 || Object.keys(req.params).length > 0) {
        return res.status(400).end();
    }

    if (Object.keys(req.body).length > 0) {
        console.log(req.body);
        return res.status(400).end();
    }
    const user = req.user;
    client.timing('api.v1.user.get_self.response_time', Date.now() - start);  // Track response time
    res.status(200).json({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        account_created: user.account_created,
        account_updated: user.account_updated,
    });
});

router.put("/user/self", authenticate, async (req, res) => {
    const { email, first_name, last_name, password } = req.body;
    client.increment('api.v1.user.put_self');  // Increment call count for GET /user/self
    const start = Date.now();

    const itemsinBody = Object.keys(req.body);
    console.log("dfdfdfdf" + itemsinBody);
    let invalidFields = [];
    for (let i = 0; i < itemsinBody.length; i++) {
        const key = itemsinBody[i];
        if (key !== "first_name" && key !== "last_name" && key !== "password") {
            invalidFields.push(key);
        }
    }
    if (invalidFields.length > 0) {
        console.log(invalidFields.length + "its not zero so sending 400");
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
        // if (email) {
        //     res.status(400).end();
        // }
        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (password) user.password = password;
        const result = await user.save();
        console.log("Save result:", result);
        client.timing('api.v1.user.put_self.response_time', Date.now() - start);  // Track response time

        res.status(204).end(); // No content - as per swagger
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(400).end(); // Bad Request - as per swagger
    }
});

router.post("/user/self/pic", authenticate, upload.single("profilePic"), async (req, res) => {
    try {
        // Validate file presence
        client.increment('api.v1.user.self.post_pic');  // Increment call count for GET /user/self
        const start = Date.now();
        const file = req.file;
        if (!file) {
            return res.status(400).end(); // As per Swagger
        }
        // Validate file type
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = [".jpg", ".jpeg", ".png"];
        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).end(); // As per swagger
        }

        const user = req.user;
        console.log("User ID:", user.id);

        // Check for existing profile picture
        const existingPic = await UserProfilePic.findOne({
            where: { user_id: user.id },
        });

        if (existingPic) {
            return res.status(400).end(); //As per swagger
        }

        // Generate unique file key
        const fileKey = `profile-pics/${user.id}/${Date.now()}${fileExtension}`;

        // Prepare upload parameters
        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
            Metadata: {
                userId: user.id.toString(),
                originalName: file.originalname,
                uploadDate: new Date().toISOString()
            },
        };
        const command = new PutObjectCommand(uploadParams);
        const s3response = await AWS.send(command);

        console.log("S3 Upload Response:", s3response);

        // Create database record
        const newPic = await UserProfilePic.create({
            file_name: file.originalname,
            user_id: user.id,
            url: fileKey,
            upload_date: new Date().toISOString(),
            s3_bucket_path: fileKey,
            file_size: file.size,
            content_type: file.mimetype,
        });
        console.log(newPic.upload_date)
        formattedDateup = newPic.upload_date;
        // Return success response
        client.timing('api.v1.user.self.post_pic.response_time', Date.now() - start);  // Track response time
        res.status(201).json({
            file_name: newPic.file_name,
            id: newPic.id,
            url: newPic.url,
            upload_date: formattedDateup,
            user_id: newPic.user_id,
        });
    } catch (error) {
        console.error("Error uploading to S3:", error);
        return res.status(400).end(); // As per Swagger 
    }
}
);

router.delete("/user/self/pic", authenticate, async (req, res) => {
    try {
        client.increment('api.v1.user.self.delete_pic');  // Increment call count for GET /user/self
        const start = Date.now();
        const user = req.user;
        console.log("User ID:", user.id);

        // Check if user has an existing profile picture
        const existingPic = await UserProfilePic.findOne({
            where: { user_id: user.id },
        });

        if (!existingPic) {
            return res.status(404).end(); //As Per swagger
        }

        // Check if the picture belongs to the authenticated user
        if (existingPic.user_id !== user.id) {
            return res.status(401).end(); //As per swagger
        }

        // Delete the image from S3

        const deleteParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: existingPic.s3_bucket_path, // Path to the image in S3
        };
        const command = new DeleteObjectCommand(deleteParams);
        const response = await AWS.send(command);

        console.log("S3 Image deleted:", existingPic.s3_bucket_path + response);

        // Delete the database record (hard delete)
        await existingPic.destroy();
        client.timing('api.v1.user.self.delete_pic.response_time', Date.now() - start);  // Track response time
        // Return success response
        res.status(204).end(); //As per swagger
    } catch (error) {
        console.error("Error deleting profile picture:", error);
        return res.status(404).end() // As per swagger
    }
});

router.get("/user/self/pic", authenticate, async (req, res) => {
    try {
        client.increment('api.v1.user.self.get_pic');  // Increment call count for GET /user/self
        const start = Date.now();
        const user = req.user;
        console.log("User ID:", user.id);

        // Check for existing profile picture
        const Pic = await UserProfilePic.findOne({
            where: { user_id: user.id },
        });


        if (Pic) {
            const uploadDate = Pic.upload_date;
            // formattedDate = uploadDate.toISOString().slice(0, 10);
            client.timing('api.v1.user.self.get_pic.response_time', Date.now() - start);  // Track response time
            res.status(201).json({
                file_name: Pic.file_name,
                id: Pic.id,
                url: Pic.url,
                upload_date: uploadDate,
                user_id: Pic.user_id,
            });
        }
        else {
            res.status(404).end(); // As per swagger 
        }



    } catch (error) {
        console.error("Error finding image:", error);
        return res.status(404).end() //As per swagger
    }
}
);

// NOT_SUPPORTED ROUTES for /user/self/pic - Respond with 405
// 1. PUT
// 2. HEAD
// 3. OPTIONS
// 4. PATCH

router.put("/user/self/pic", async (req, res) => {
    client.increment('api.v1.user.self.pic.put_unsupported');
    res.status(405).end();
});
router.head("/user/self/pic", async (req, res) => {
    client.increment('api.v1.user.self.pic.head_unsupported');
    res.status(405).end();
});
router.options("/user/self/pic", async (req, res) => {
    client.increment('api.v1.user.self.pic.options_unsupported');
    res.status(405).end();
});
router.patch("/user/self/pic", async (req, res) => {
    client.increment('api.v1.user.self.pic.patch_unsupported');
    res.status(405).end();
});

// NOT_SUPPORTED ROUTES for /user/self - Respond with 405
// 1. DELETE
// 2. HEAD
// 3. OPTIONS
// 4. PATCH

router.delete("/user/self", async (req, res) => {
    client.increment('api.v1.user.self.delete_unsupported');
    res.status(405).end();
});
router.head("/user/self", async (req, res) => {
    client.increment('api.v1.user.self.head_unsupported');
    res.status(405).end();
});
router.options("/user/self", async (req, res) => {
    client.increment('api.v1.user.self.options_unsupported');
    res.status(405).end();
});
router.patch("/user/self", async (req, res) => {
    client.increment('api.v1.user.self.patch_unsupported');
    res.status(405).end();
});
router.post("/user/self", async (req, res) => {
    client.increment('api.v1.user.self.post_unsupported');
    res.status(405).end();
});
// NOT_SUPPORTED ROUTES for /user - Respond with 405
// 1. DELETE
// 2. HEAD
// 3. OPTIONS
// 4. PATCH
// 5. GET
// 6. PUT

router.delete("/user", async (req, res) => {
    client.increment('api.v1.user.delete_unsupported');
    res.status(405).end();
});
router.head("/user", async (req, res) => {
    client.increment('api.v1.user.head_unsupported');
    res.status(405).end();
});
router.options("/user", async (req, res) => {
    client.increment('api.v1.user.options_unsupported');
    res.status(405).end();
});
router.patch("/user", async (req, res) => {
    client.increment('api.v1.user.patch_unsupported');
    res.status(405).end();
});
router.get("/user", async (req, res) => {
    client.increment('api.v1.user.get_unsupported');
    res.status(405).end();
});
router.put("/user", async (req, res) => {
    client.increment('api.v1.user.put_unsupported');
    res.status(405).end();
});
module.exports = router;
