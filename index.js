const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID  = require('mongodb').ObjectID;
const app = express();
const port = process.env.PORT || 5058;
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
res.send('Hello World!!!!');
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rzm4j.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection errrrrrrr', err)
    const eventCollection = client.db("fresh-valley").collection("products");
    const ordersCollection = client.db("fresh-valley").collection("orders");
    console.log('database connection');
    const newOrder = client.db("fresh-valley").collection("newOrder");
    // console.log(eventCollection)
  
    app.get('/products', (req, res) => {
        eventCollection.find()
        .toArray((err, items) => {
            res.send(items);
        })
    })

    app.get('/newOrder', (req, res) => {
        newOrder.find()
        .toArray((err, items) => {
            res.send(items);
        })
    })

    app.get('/orders/:email', (req, res) => {
        console.log(req.params.email);
        const email =req.params.email;
      console.log('dele this', email);
        ordersCollection.find({email:email})
        .toArray((err, items) => {
            console.log(items);
            res.send(items);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            // console.log(result);
            res.send(result.insertedCount > 0)
    
        })
    })

    app.post('/addToOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            console.log(result);
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/addNewOrder', (req, res) => {
        const order = req.body;
        newOrder.insertOne(order)
        .then(result => {
            console.log(result);
            res.send(result.insertedCount > 0)
    
        })
    
    })

  app.post('/addProduct', (req, res) => {
      const newEvent = req.body;
      console.log('adding new event: ', newEvent)
      eventCollection.insertOne(newEvent)
      .then(result => {
          console.log('inserted count', result.insertedCount);
          res.send(result.insertedCount > 0)
      })
  })

  app.delete('/delete/:id', (req, res) => {
      
      const id = ObjectID(req.params.id);
      console.log('delete this', id);
      eventCollection.findOneAndDelete({_id: id})
      .then(documents => {
          res.send(!!documents.value);
        })
  })

  app.delete('/deleteOldOrder', (req, res) => {
      
    const id = ObjectID(req.params.id);
    console.log('delete this', id);
    newOrder.deleteMany()
    .then(documents => {
        res.send(!!documents.value);
      })
})

});

app.listen(port);