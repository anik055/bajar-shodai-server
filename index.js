const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID  = require('mongodb').ObjectID;
const app = express();
const port = process.env.PORT || 5056;
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
res.send('Hello World!!!!');
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rzm4j.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)
    const eventCollection = client.db("fresh-valley").collection("products");
    const ordersCollection = client.db("fresh-valley").collection("orders");
    console.log('database connection');
    // console.log(eventCollection)
  
    app.get('/events', (req, res) => {
        eventCollection.find()
        .toArray((err, items) => {
            res.send(items);
        })
    })

    app.get('/orders', (req, res) => {
        ordersCollection.find()
        .toArray((err, items) => {
            res.send(items);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
          //   console.log(result);
            res.send(result.insertedCount > 0)
    
        })
    
    })

  app.post('/addEvent', (req, res) => {
      const newEvent = req.body;
      console.log('adding new event: ', newEvent)
      eventCollection.insertOne(newEvent)
      .then(result => {
          console.log('inserted count', result.insertedCount);
          res.send(result.insertedCount > 0)
      })
  })

//   app.delete('deleteEvent/:id', (req, res) => {
//       const id = ObjectID(req.params.id);
//       console.log('delete this', id);
//       eventCollection.findOneAndDelete({_id: id})
//       .then(documents => res.send(!!documents.value))
//   })

//   client.close();
});



app.listen(port);