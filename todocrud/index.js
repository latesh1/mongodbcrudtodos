const express = require("express");
const { UserModel, TodoModel } = require("./db");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const JWT_SECRET = "123123";

mongoose.connect("mongodb+srv://admin:Latesh%40987@cluster111.7vpqgc5.mongodb.net/todoappdatabase")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const app = express();
app.use(express.json());   // ✅ FIXED (important)

// SIGNUP
app.post("/signup", async function (req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;

        await UserModel.create({
            email: email,
            password: password,
            name: name
        });

        res.json({
            message: "User created successfully"
        });
    } catch (err) {
        res.status(400).json({
            message: "Error creating user"
        });
    }
});

// SIGNIN
app.post("/signin", async function (req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await UserModel.findOne({
            email: email,
            password: password
        });

        if (user) {
            const token = jwt.sign(
                { id: user._id.toString() },
                JWT_SECRET   // ✅ FIXED
            );

            res.json({
                token: token
            });
        } else {
            res.status(403).json({
                message: "Incorrect credentials"
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Error signing in"
        });
    }
});

// Dummy routes (so they don't hang)
app.post("/todo", auth ,function (req, res) {
   const userId =req.userId;
   const title =req.body.title;
   TodoModel.create({
    title,
    userId
   })
    res.json({
    userId :userId
   })
});

app.get("/todos",auth, async function (req, res) {
   const userId =req.userId;
   const todos = await TodoModel.find({
    userId:userId

   })
   res.json({
    todos
   })
});

function auth(req,res,next){
    const token = req.headers.token;
    const decodeddata = jwt.verify(token,JWT_SECRET);
    if(decodeddata){
        req.userId=decodeddata.id;
        next();
    }else{
        res.status(403).json({
            message:"incorrect credentials"
        })
    }
}

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
