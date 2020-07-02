const express = require('express')
const app = express()
const reddit = require('random-puppy')
const axios = require('axios')

function GetCustom(cata) {
    return new Promise((fulfill, reject) => {
        reddit(cata).then(m=>{
            fulfill(m)
        }).catch(reject)
    })
}

app.use(express.static("public"))
app.get("/", function(req, res){
    res.status(200).sendFile(__dirname + "/views/index.html")
})
app.get("/reddit/:subreddit", function(req, res) {
    if(!req.params.subreddit) {
        return res.status(401).send("An error occurred you didnt provid any parameters")
    }
    GetCustom(req.params.subreddit).then(img=>{
        if(img){
            res.status(200).send({endpoint: req.params.subreddit, img: img})
        } else {
            throw new Error("Internal Error")
        }
    }).catch(e => {
        console.log(e)
        res.status(500).send({endpoint: req.params.subreddit, error: e+ "This could also be because of an invalid subreddit"})
    })
})
app.use(function(req, res) {
    res.status(404).send('<html><head><body><center><h1>Hmm thats not a valid page</h1></center></body></head></html>')
})
const listener = app.listen(process.env.PORT, function(){
    console.log(`Your app is listening at port ${listener.address().port}`)
})
