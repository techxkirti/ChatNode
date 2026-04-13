const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main()
.then(() => {
    console.log("Connection Successful!");
    return seedDB();
})
.catch(err => console.log(err));

async function main() {
    const dbUrl = process.env.ATLAS_DB_URL || 'mongodb://127.0.0.1:27017/ChatNode';
    await mongoose.connect(dbUrl);
}

let allChats = [
    {
    from: "neha",
    to: "preeti",
    msg: "send me notes for exam"
    },
    {
    from: "rohit",
    to: "mohit",
    msg: "teach me JS callbacks"
    },
    {
    from: "amit",
    to: "sumit",
    msg: "all the best"
    },
    {
    from: "anita",
    to: "ramesh",
    msg: "bring me some friuts"
    },
    {
    from: "tony",
    to: "peter",
    msg: "love you 3000"
    }
];

async function seedDB() {
    try {
        await Chat.deleteMany({});
        await Chat.insertMany(allChats);
        console.log("Database initialized!");
    } catch (err) {
        console.log("Error seeding data:", err);
    } finally {
        mongoose.connection.close(); 
    }
}