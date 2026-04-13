if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

require("node:dns").setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

main()
.then(() => {
    console.log("Connection Successful!");
})
.catch(err => console.log(err));

async function main() {
    const dbUrl = process.env.ATLAS_DB_URL || 'mongodb://127.0.0.1:27017/ChatNode';
    await mongoose.connect(dbUrl);
}

app.get("/", (req, res)=> {
    res.send("Root is working.");
});

//Index Route: 
app.get("/chats", async(req, res) => {
    let chats = await Chat.find();
    res.render("index.ejs", { chats });
});

//New Route:
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
});

//Create Route:
app.post("/chats", async (req, res) => {
    try {
        let {from, msg, to} = req.body;
    let newChat = await new Chat({
        from: from,
        msg: msg,
        to: to,
        created_at: new Date()
    });
    
    await newChat.save();
    console.log("Chat saved");
    res.redirect("/chats");
    } catch(err) {
        console.log(err);
    };
});

//Edit Route:
app.get("/chats/:id/edit", async(req, res) => {
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", {chat});
});

//Update Route:
app.put("/chats/:id", async(req, res) => {
    let {id} = req.params;
    let { msg: newMsg } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(id, {msg: newMsg}, {new: true, runValidators: true});
    console.log("Chat Updated.");
    res.redirect("/chats");
});

//Destroy Route: 
app.delete("/chats/:id", async (req, res) => {
    let {id} = req.params;
    await Chat.findByIdAndDelete(id);
    res.redirect("/chats");
});

app.listen(3000, () => {
    console.log("Server is listening on port.");
});