//jshint esversion:6
require('dotenv').config({ path: 'config.env' })

const cors = require('cors');
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
const mongoDB = process.env.ATLAS_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// View Engine
app.set('view engine', 'ejs')
// Middleware & static files
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// cors
app.use(cors({ origin: true, credentials: true }))

//404
// app.use((req,res) => {
//     res.render('404',{ title:'Not Found' });
// })


//Schema

const playerSchema = new mongoose.Schema({
    name: String,
    required: false,
    score: Number
})

const Player = mongoose.model(
    "Player",
    playerSchema
)

// const newPerson = new Player({ name: 'Ronald M' });
// newPerson.save().then(() => console.log('meow'));

const player1 = new Player ({
    name: "Alex",
    score: 0
})

const player2 = new Player ({
    name: "Nelson",
    score: 69
})

const player3 = new Player ({
    name: "Denis",
    score: 100
})
const player4 = new Player ({
    name: "Lourdes",
    score: 150
})

const defaultPlayers = [player1, player2, player3, player4];

// Player.insertMany(defaultPlayers, function(err){
//     if (err){
//         console.log(err, "Insert Many Unsuccessful")
//     }else{
//         console.log("Insert Successful")
//     }
// })




app.get("/", function(req, res){
    Player.find({}, function(err, foundPlayers){
        if (err){
            console.log(err, "error on find")
        }else{
            console.log("Found Successful")
        }
        if(foundPlayers.length === 0){
            Player.insertMany(defaultPlayers, function(err){
                if (err){
                    console.log(err, "Insert Many Unsuccessful")
                }else{
                    console.log("Insert Successful")
                }
            })
            res.redirect("/")
        } else {
            res.render("scoreboard", {
                scoreboardTitle: "Yahzee Leaderboard",
                newListPlayers: foundPlayers
            })
        } 
    })
})

// app.get("/:customListName", function(req, res){
//     console.log(req.params.customListName)
//     })

app.post("/", function(req, res){
    console.log("Post Request")
})

let port = process.env.PORT;
if(port == null || port == ""){
    port = 3000;
}

app.listen(port, function (){
    console.log("Server Started on port 3000")
})

