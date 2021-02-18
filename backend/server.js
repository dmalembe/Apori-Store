const PORT = 5000;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app =  express();
const routes = express.Router();
app.use("/api",routes);

//body-parser
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());
const jsonParser = bodyParser.json();

//cors
routes.use(cors());

//mongoDB client
const MongoClient = require("mongodb").MongoClient;
const uri =  
 "mongodb+srv://dmalembe:Octave_01@cluster0.cuk33.mongodb.net/marketplace?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// connect to server
app.listen(PORT, () => {
    console.log(`Server up and running on http://localhost:${PORT}`);
  });

// connect to DB
const DATABASE = "marketplace";
client.connect((err) => {
    if(err) {
        throw Error(err);
    }
    !err && console.log('Sucessfully connected to database');
    const db = client.db(DATABASE);
    const products = db.collection("products");

    // perform actions on the collection object

    //GET
    routes.get("/products",function(req,res) {
        products
        .find()
        .toArray()
        .then((error,results) => {
            if(error) {
                return res.send(error);
            }
            res.status(200).send({ results }); 
        })
        .catch((err) => res.send(err));
    });
    //POST
    routes.post("/products/add",jsonParser,function(req,res) {
        products
            .insertOne(req.body)
            .then(() => res.status(200).send("Successfully inserted new document"))
            .catch((err) => {
                console.log(err);
                res.send(err);
            });
    });
    //
});

