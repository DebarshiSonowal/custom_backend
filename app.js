const express = require('express')
const app = express();
const mongoClient = require('mongodb').MongoClient

const url = "mongodb://localhost:27017"

app.use(express.json())
mongoClient.connect(url,{useNewUrlParser: true, useUnifiedTopology: true},(err, db)=>{
    if(err){
         console.log(err.message)
    }else{
        const myDb = db.db("myDb")
        const collection = myDb.collection("myTable")

        app.post('/singup',(req,res)=>{
            const newuser ={
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }
            const querry = {email: newuser.email}

            collection.findOne(querry, (err,result)=>{
                if(result == null){
                    collection.insertOne(newuser,(err,result)=>{
                        res.status(200).send()
                    })
                }else{
                    res.status(400).send()
                }
            })
        })
        app.post('/login',(req,res)=>{
            const querry={
                email: req.body.email,
                password: req.body.password
            }
            collection.findOne(querry,(err,result)=>{
               if(result != null){
                    const objToSend={
                    name: result.name,
                    email: result.emails
                }
                 res.status(200).send()
               }else{
                 res.status(404).send()
               }
               
            })
        })
    }
})
app.listen(3000,()=>{
    console.log("Listening on port 3000")
})