const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const cors = require("cors")
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')

const app = express()
const port = 3000
app.use(express.json())
app.use(cors())
app.use(cookieParser())
mongoose.connect("mongodb://127.0.0.1:27017/userData")
    .then(() => console.log("connection created"))
    .catch((error) => console.log(error))

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model("usersNew", userSchema)
// profile
app.get("/profile", (req, res) => {
    const cookie = req.cookies
    console.log(cookie)
    // validate my token
    res.send("send data")
})
// post signup

app.post("/users", async (req, res) => {

    try {
        const body = req.body


        if (!body || !body.firstName || !body.email || !body.password) {
            return res.json({ msg: "all fields are required" })
        } else {
            const hashedPassword = await bcrypt.hash(body.password, 10)
            console.log("hashedPassword", hashedPassword)
            const result = await User.create({
                firstName: body.firstName,
                email: body.email,
                password: hashedPassword
            })
            return res.json({ data: "success", result })
        }


    } catch (error) {
        return res.json({ error })
    }
})

// login

app.post("/users/login", async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ msg: "all fields are required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ msg: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ msg: "credentials wrong" })
        }

        // create a jwt token


        // send back response to the user
        res.cookie("token", "asdhhhuey27sndq02ndiuqye3msoi")

        return res.status(200).json({ msg: "success login", data: user })



    } catch (error) {
        return res.status(500).json({ error })
    }
})
// get
app.get("/users", async (req, res) => {
    const getUsers = await User.find({})
    return res.json(getUsers)
})
// get user by id
app.get("/users/:id", async (req, res) => {
    const id = req.params.id

    const getUsers = await User.findById(id)
    return res.json(getUsers)
})
// update
app.put("/users/:id", async (req, res) => {
    const id = req.params.id
    const getUserData = req.body
    console.log(getUserData)
    try {

        const updatedData = await User.findByIdAndUpdate(id, getUserData)
        if (!updatedData) {
            return res.json({ msg: "error" })
        }
        return res.json(updatedData)
    } catch (error) {
        return res.json({ error })
    }
})
// delete
app.delete("/users/:id", async (req, res) => {
    const id = req.params.id
    try {
        const deleteData = await User.findByIdAndDelete(id)
        if (!deleteData) {
            return res.json({ msg: "error" })
        }
        return res.json(deleteData)
    } catch (error) {
        return res.json({ error })
    }

})

app.listen(port, () => {
    console.log("server is running!")
})