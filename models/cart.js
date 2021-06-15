const mongoose = require("mongoose");

let CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    userName:{
      type: String,
      required: true
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
    active: {
      type: Boolean,
      default: true
    },
    modifiedOn: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", CartSchema);
module.exports = mongoose.model("Cart", CartSchema);
