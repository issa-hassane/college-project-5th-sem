const mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
    userName:{
        type: String,
        require: true
    },
      products: [
        {
          productId: String,
          quantity: Number,
          name: String,
          details: String,
          img: String,
          price: Number,
          unitPrice: Number
        }
      ],

    date: {
        type: Date,
        default: new Date
    }
});

module.exports = mongoose.model("Order", orderSchema);