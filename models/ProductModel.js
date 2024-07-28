
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  
  {
    name: {
      type: String,
      required: [true, "Product name must be entered."]
    },

    quantity: {
      type: Number,
      //required: true,
      default: 0
    },

    price: {
      type: Number,
      //required: true
    },

    image: {
      type: String,
      //required: false
    }
  },
  {
    timestamps: true
  }

);//ProductSchema


const ProductModel = mongoose.model('Product', ProductSchema);
module.exports = ProductModel;

