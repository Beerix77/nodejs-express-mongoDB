const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/ProductModel.js');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));


//* CONNECT to mongoDB and LISTEN:
mongoose.connect(process.env.SECRET_URL)
.then( () => {
  console.log('Connected to MongoDB...');
  app.listen(process.env.PORT, () => {
    console.log(`Node API app is listening on http://localhost:${process.env.PORT}`);
  });
})
.catch( (err) => {
  console.log('ERROR CONNECTING...');
})


//* GET '/':
app.get('/', (req, res) => {
  res.send(`Hello Browser!!!`)
});



//* POST:
app.post('/products', async (req, res) => {
  try {
    //console.log('req.body DATA2:', req.body);
    const newProduct = await Product.create({
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
      image: req.body.image
    });
    res.status(200).json(newProduct);
  } catch(err) {
    console.log('There was an error ADDING product...', err.message);
    res.status(500).json({error: err.message});
  }
});


//* GET all:
app.get('/products', async (req, res) => {
  try {
    const allProducts = await Product.find().select('name price');
    res.status(200).json(allProducts);
  } catch(err) {
    console.log('There was an error listing ALL PRODUCTS...', err.message);
    res.status(500).json({error: err.message});
  }
});


//*GET from _id:
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({_id: req.params.id});
    res.status(200).json(product);
  } catch(err) {
    console.log('There was an error listing PRODUCT...', err.message);
    res.status(500).json({error: err.message});
  }
});//GET :id



//*UPDATE:
app.put('/products/:id', async (req, res) => {
  try {
    const {id} = req.params; //*delete?
    const product = await Product.findByIdAndUpdate( id, { 
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
      image: req.body.image
    })
    if (product === null){
      res.sendStatus(404);
    } else {
      res.json(product); //show updated product only (not list of products)
    }
      //const updatedList = await Product.findById(id); //* show updated product i.e. load it updated
      //res.status(200).json(updatedList);

  } catch(err) {
    console.log('There was an error UPDATING product...', err.message);
    res.status(422).json({error: err.message});

  }
});//PUT :id



//* DELETE:
app.delete('/products/:id', async (req, res) => {

  try {
    const {id} = req.params;
    const product = await Product.findByIdAndDelete(id);
    if(!product){
      return res.status(404).json({error: `Cannot find product with ID: ${id}`});
    } 
    res.status(200).json(product);
    
  } catch(err) {
    console.log('There was an error deleting...', err.message);
    res.status(422).json({err: err.message})
  }

});// DELETE