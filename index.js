const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const app = express();

app.use(cors());
app.use(bodyParser.json());

const dbUser = process.env.DB_USER;
const pass = process.env.DB_PASS;

const uri = process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true });

const users = ["Asad", "Moin", "Susmita", "Sabed", "Sohana",'sabana'];

app.get('/products', (req,res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find().toArray((err, documents)=>{
            if(err){
                console.log(err);
                res.status(500).send({message:err});
            }
            else{
                res.send(documents);
            }
            
        });
       // client.close();
      });  

});

app.get('/fruits/banana',(req,res)=>{
    res.send({fruit:'banana', quantity:1000, price:10000})
})

app.get('/product/:key', (req,res)=>{
    const key = req.params.key;

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({key}).toArray((err, documents)=>{
            if(err){
                console.log(err);
                res.status(500).send({message:err});
            }
            else{
                res.send(documents[0]);
            }
            
        });
       client.close();
      });
})



app.post('/getProductsByKey', (req,res)=>{
    const key = req.params.key;
    const productKeys = req.body;
    console.log(productKeys);
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({key: { $in: productKeys }}).toArray((err, documents)=>{
            if(err){
                console.log(err);
                res.status(500).send({message:err});
            }
            else{
                res.send(documents);
            }
            
        });
       client.close();
      });
})

//delete
//update
//post

app.post('/addProduct' , (req, res) => {
        //save to database
        const product = req.body;
        client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(err => {
            const collection = client.db("onlineStore").collection("products");
            collection.insert(product, (err, result)=>{
                if(err){
                    console.log(err);
                    res.status(500).send({message:err});
                }
                else{
                    res.send(result.ops[0]);
                }
                
            });
           client.close();
          });        
});



app.post('/placeOrder' , (req, res) => {
    //save to database
    const orderDetails = req.body;
    orderDetails.orderTime = new Date();
    console.log(orderDetails);
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("orders");
        collection.insertOne(orderDetails, (err, result)=>{
            if(err){
                console.log(err);
                res.status(500).send({message:err});
            }
            else{
                res.send(result.ops[0]);
            }
            
        });
        client.close();
      });        
});


const port = process.env.PORT || 42
app.listen(port, () => console.log('listening to port 4200'));